import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:permission_handler/permission_handler.dart';
import '../app_colors.dart';
import '../services/classifier_service.dart';
import '../services/hand_service.dart';
import '../services/history_service.dart';
import '../services/tts_service.dart';
import '../widgets/hand_painter.dart';

class DetectScreen extends StatefulWidget {
  final ClassifierService? classifier;
  final TtsService? tts;
  const DetectScreen({super.key, this.classifier, this.tts});

  @override
  State<DetectScreen> createState() => _DetectScreenState();
}

class _DetectScreenState extends State<DetectScreen> {
  // Camera
  CameraController? _cam;
  List<CameraDescription> _cameras = [];
  int _camIdx = 0;
  bool _camReady = false;

  // Detection
  final _hand = HandService();
  bool _processing = false;
  bool _detecting = false; // user pressed START

  // Toggles
  bool _speech = false;
  bool _wordMode = false;

  // Detection output
  List<double> _landmarks = [];
  String _currentLetter = '';
  String _lastLetter = '';

  // Auto-commit letter: count consecutive frames of the same letter
  int _stableFrames = 0;
  String _stableCandidate = '';
  String _lastCommittedLetter = '';
  static const int _stableThreshold = 20; // ~1 sec at ~20fps

  // Auto-commit word: count frames with no hand/confidence
  int _noHandFrames = 0;
  static const int _noHandThreshold = 30; // ~1.5 sec pause = end of word

  // Word/sentence builder
  String _currentWord = '';
  List<String> _sentence = [];
  bool _copied = false;

  @override
  void initState() {
    super.initState();
    _initCameras();
  }

  Future<void> _initCameras() async {
    if (!await Permission.camera.request().isGranted) return;
    _cameras = await availableCameras();
    if (_cameras.isEmpty) return;
    _camIdx = _cameras.indexWhere(
        (c) => c.lensDirection == CameraLensDirection.front);
    if (_camIdx < 0) _camIdx = 0;
    await _startCamera();
  }

  Future<void> _startCamera() async {
    await _cam?.stopImageStream();
    await _cam?.dispose();
    _cam = null;
    if (mounted) setState(() => _camReady = false);

    final ctrl = CameraController(
      _cameras[_camIdx], ResolutionPreset.medium,
      enableAudio: false, imageFormatGroup: ImageFormatGroup.yuv420,
    );
    await ctrl.initialize();
    if (mounted) setState(() { _cam = ctrl; _camReady = true; });
  }

  void _startDetection() {
    if (_cam == null || !_camReady) return;
    _cam!.startImageStream(_onFrame);
    setState(() { _detecting = true; _currentLetter = ''; _lastLetter = ''; });
  }

  Future<void> _stopDetection() async {
    await _cam?.stopImageStream();
    _stableCandidate = '';
    _stableFrames = 0;
    _lastCommittedLetter = '';
    _noHandFrames = 0;
    if (mounted) setState(() { _detecting = false; _landmarks = []; _currentLetter = ''; });
  }

  // Use sensor orientation directly — this is the CW degrees needed to rotate
  // the raw sensor frame to portrait-upright (same value as Android EXIF rotation).
  int get _rotation {
    if (_cameras.isEmpty || _camIdx >= _cameras.length) return 0;
    return _cameras[_camIdx].sensorOrientation;
  }

  bool get _isFront =>
      _camIdx < _cameras.length &&
      _cameras[_camIdx].lensDirection == CameraLensDirection.front;

  void _onFrame(CameraImage img) async {
    if (_processing) return;           // only gate on processing, NOT classifier
    _processing = true;
    try {
      List<double>? raw = await _hand.detect(
        nv21Bytes: _toNv21(img),
        width: img.width,
        height: img.height,
        rotation: _rotation,
      );
      if (raw == null) {
        if (mounted) setState(() { _landmarks = []; });
        _stableCandidate = '';
        _stableFrames = 0;
        _noHandFrames++;
        if (_noHandFrames == _noHandThreshold && _currentWord.isNotEmpty) {
          _addWord();
        }
        return;
      }
      _noHandFrames = 0;
      // Front camera preview is mirrored (selfie view): flip landmark X so the
      // skeleton overlay aligns with the visible hand position on screen.
      final lm = _isFront
          ? List<double>.generate(raw.length, (i) => i.isEven ? 1.0 - raw[i] : raw[i])
          : raw;

      // Always show landmarks even if classifier isn't ready
      if (mounted) setState(() => _landmarks = lm);

      // Classification — only when classifier is loaded
      if (widget.classifier == null || !widget.classifier!.isReady) return;
      final mode = _wordMode ? 1 : 0;
      // After physical bitmap rotation the landmarks are in portrait space:
      // portrait_width = sensor_height, portrait_height = sensor_width
      final rot = _rotation;
      final pW = (rot == 90 || rot == 270) ? img.height : img.width;
      final pH = (rot == 90 || rot == 270) ? img.width  : img.height;
      final result = widget.classifier!.predict(raw, pW, pH, mode);
      if (result == null || result.confidence < 0.5) {
        _stableCandidate = '';
        _stableFrames = 0;
        _noHandFrames++;
        if (_noHandFrames == _noHandThreshold && _currentWord.isNotEmpty) {
          _addWord();
        }
        return;
      }
      _noHandFrames = 0;
      final label = result.label;

      // Update displayed letter
      if (label != _lastLetter) {
        _lastLetter = label;
        if (mounted) setState(() => _currentLetter = label);
        if (_speech) widget.tts?.speak(label);
      }

      // Auto-commit: when same letter held for _stableThreshold consecutive frames,
      // append it to the word bar once (require a different letter before committing same again)
      if (label != _stableCandidate) {
        _stableCandidate = label;
        _stableFrames = 0;
        _lastCommittedLetter = '';
      }
      _stableFrames++;
      if (_stableFrames == _stableThreshold && label != _lastCommittedLetter) {
        _lastCommittedLetter = label;
        if (mounted) setState(() => _currentWord += label);
      }
    } catch (e) {
      debugPrint('LinguaSign detect: $e');
    } finally {
      _processing = false;
    }
  }

  Uint8List _toNv21(CameraImage img) {
    final w = img.width, h = img.height;
    final yp = img.planes[0], up = img.planes[1], vp = img.planes[2];
    final out = Uint8List(w * h + (w * h ~/ 2));
    int i = 0;
    for (int row = 0; row < h; row++) {
      final base = row * yp.bytesPerRow;
      for (int col = 0; col < w; col++) out[i++] = yp.bytes[base + col];
    }
    final uvH = h ~/ 2, uvW = w ~/ 2;
    final uPs = up.bytesPerPixel ?? 1, vPs = vp.bytesPerPixel ?? 1;
    for (int row = 0; row < uvH; row++) {
      final uR = row * up.bytesPerRow, vR = row * vp.bytesPerRow;
      for (int col = 0; col < uvW; col++) {
        out[i++] = vp.bytes[vR + col * vPs];
        out[i++] = up.bytes[uR + col * uPs];
      }
    }
    return out;
  }

  void _deleteLetter() {
    if (_currentWord.isEmpty) return;
    final chars = _currentWord.characters.toList();
    setState(() => _currentWord = chars.take(chars.length - 1).join());
  }

  void _addWord() {
    if (_currentWord.isEmpty) return;
    final word = _currentWord;
    setState(() { _sentence = [..._sentence, word]; _currentWord = ''; _currentLetter = ''; _lastLetter = ''; });
    HistoryService.saveDetection(word, 'Word');
  }

  void _removeWord(int idx) {
    setState(() => _sentence = [..._sentence]..removeAt(idx));
  }

  Future<void> _speakSentence() async {
    if (_sentence.isEmpty) return;
    final text = _sentence.join(' ');
    await HistoryService.saveDetection(text, 'Phrase');
    widget.tts?.speak(text);
  }

  void _copyToClipboard() {
    if (_sentence.isEmpty) return;
    final text = _sentence.join(' ');
    HistoryService.saveDetection(text, 'Phrase');
    Clipboard.setData(ClipboardData(text: text));
    setState(() => _copied = true);
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  void _clearSentence() => setState(() { _sentence = []; _currentWord = ''; _currentLetter = ''; _lastLetter = ''; });

  @override
  void dispose() {
    _cam?.stopImageStream();
    _cam?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: !_camReady || _cam == null
          ? const Center(child: CircularProgressIndicator(color: AC.green))
          : Stack(fit: StackFit.expand, children: [
              // Camera preview
              CameraPreview(_cam!),

              // Hand skeleton
              if (_landmarks.isNotEmpty && _detecting)
                CustomPaint(
                  painter: HandPainter(
                    _landmarks,
                    Size(_cam!.value.previewSize!.height,
                         _cam!.value.previewSize!.width),
                  ),
                ),

              // Full overlay
              SafeArea(child: Column(children: [

                // ── Top bar ──────────────────────────────
                _buildTopBar(),

                // ── Sentence chips ────────────────────────
                if (_sentence.isNotEmpty) _buildSentenceArea(),

                // ── Word bar ──────────────────────────────
                _buildWordBar(),

                const Spacer(),

                // ── Bottom controls ───────────────────────
                _buildBottomControls(),
              ])),
            ]),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Top bar: back · "Sign Detection" badge · Speech · Word-Mode
  Widget _buildTopBar() => Container(
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
    decoration: BoxDecoration(
      gradient: LinearGradient(
        colors: [Colors.black.withValues(alpha: 0.7), Colors.transparent],
        begin: Alignment.topCenter, end: Alignment.bottomCenter,
      ),
    ),
    child: Row(children: [
      _glassBtn(Icons.arrow_back_rounded, () => Navigator.maybePop(context)),
      const SizedBox(width: 10),
      // Status badge
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 6),
        decoration: BoxDecoration(
          color: _detecting ? Colors.black.withValues(alpha: 0.5) : Colors.black.withValues(alpha: 0.35),
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
        ),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          if (_detecting) ...[
            Container(width: 7, height: 7, decoration: const BoxDecoration(color: AC.green, shape: BoxShape.circle)),
            const SizedBox(width: 6),
          ],
          Text(_detecting ? 'LIVE' : 'Sign Detection',
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 12.5)),
          const SizedBox(width: 7),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(color: AC.greenSoft, borderRadius: BorderRadius.circular(999)),
            child: const Text('PSL', style: TextStyle(color: AC.green, fontSize: 10, fontWeight: FontWeight.w700)),
          ),
        ]),
      ),
      const Spacer(),
      // Speech toggle
      _pillToggle('Speech', _speech, () => setState(() => _speech = !_speech)),
      const SizedBox(width: 8),
      // Word mode toggle
      _pillToggle('Word', _wordMode, () => setState(() {
        _wordMode = !_wordMode;
        _currentLetter = '';
        _lastLetter = '';
      })),
    ]),
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Sentence chips (RTL Urdu words)
  Widget _buildSentenceArea() => Padding(
    padding: const EdgeInsets.fromLTRB(14, 4, 14, 0),
    child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
      Wrap(
        alignment: WrapAlignment.start,
        spacing: 6, runSpacing: 4,
        children: _sentence.asMap().entries.map((e) => GestureDetector(
          onTap: () => _removeWord(e.key),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.55),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
                e.value,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white),
                textDirection: TextDirection.rtl),
          ),
        )).toList(),
      ),
      const SizedBox(height: 6),
      Row(mainAxisAlignment: MainAxisAlignment.end, children: [
        _actionPill(Icons.volume_up_rounded, 'Speak', onTap: _speakSentence),
        const SizedBox(width: 6),
        _actionPill(_copied ? Icons.check_rounded : Icons.copy_rounded,
            _copied ? 'Copied!' : 'Copy', onTap: _copyToClipboard),
        const SizedBox(width: 6),
        _actionPill(Icons.close_rounded, 'Clear', onTap: _clearSentence),
      ]),
    ]),
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Word bar (shows current word being built)
  Widget _buildWordBar() => Padding(
    padding: const EdgeInsets.fromLTRB(14, 8, 14, 0),
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: _detecting ? Colors.black.withValues(alpha: 0.65) : AC.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
            color: _detecting
                ? Colors.white.withValues(alpha: 0.08)
                : AC.line),
      ),
      child: Row(children: [
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
          Text('WORD',
              style: TextStyle(
                fontSize: 9, fontWeight: FontWeight.w700, letterSpacing: 0.1,
                color: _detecting ? Colors.white.withValues(alpha: 0.4) : AC.inkFaint,
              )),
          const SizedBox(height: 3),
          Text(
            _currentWord.isEmpty ? '—' : _currentWord,
            style: TextStyle(
              fontSize: 20, fontWeight: FontWeight.w700, height: 1,
              color: _currentWord.isNotEmpty
                  ? (_detecting ? Colors.white : AC.ink)
                  : (_detecting ? Colors.white.withValues(alpha: 0.2) : AC.inkFaint),
            ),
            textDirection: TextDirection.rtl,
          ),
        ])),
        if (_currentWord.isNotEmpty) ...[
          const SizedBox(width: 10),
          GestureDetector(
            onTap: _deleteLetter,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: _detecting ? Colors.white.withValues(alpha: 0.1) : AC.surface2,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: _detecting ? Colors.white.withValues(alpha: 0.12) : AC.line),
              ),
              child: Text('← Del',
                  style: TextStyle(
                      fontSize: 12, fontWeight: FontWeight.w600,
                      color: _detecting ? Colors.white : AC.inkSoft)),
            ),
          ),
        ],
      ]),
    ),
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Bottom: LETTER circle | START/STOP | ACCEPT/ADD
  Widget _buildBottomControls() => Container(
    padding: const EdgeInsets.fromLTRB(24, 14, 24, 32),
    decoration: BoxDecoration(
      gradient: LinearGradient(
        colors: [Colors.transparent,
                 _detecting ? Colors.black.withValues(alpha: 0.75) : Colors.black.withValues(alpha: 0.6)],
        begin: Alignment.topCenter, end: Alignment.bottomCenter,
      ),
    ),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [

        // LETTER circle (left)
        Column(mainAxisSize: MainAxisSize.min, children: [
          Text('LETTER',
              style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, letterSpacing: 0.1,
                  color: _detecting ? Colors.white.withValues(alpha: 0.45) : AC.inkFaint)),
          const SizedBox(height: 7),
          Container(
            width: 56, height: 56,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: _currentLetter.isNotEmpty
                  ? (_detecting ? Colors.white : AC.green)
                  : (_detecting ? Colors.white.withValues(alpha: 0.08) : AC.surface2),
              border: Border.all(
                  color: _detecting ? Colors.white.withValues(alpha: 0.2) : AC.line, width: 2),
            ),
            alignment: Alignment.center,
            child: Text(
              _currentLetter.isEmpty ? '—' : _currentLetter,
              style: TextStyle(
                fontSize: 26, fontWeight: FontWeight.w700, height: 1,
                color: _currentLetter.isNotEmpty
                    ? (_detecting ? Colors.black : Colors.white)
                    : (_detecting ? Colors.white.withValues(alpha: 0.3) : AC.inkFaint),
              ),
              textDirection: TextDirection.rtl,
            ),
          ),
        ]),

        // START / STOP button (center)
        if (!_detecting)
          GestureDetector(
            onTap: _startDetection,
            child: Container(
              width: 80, height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AC.green,
                border: Border.all(color: AC.greenSoft, width: 4),
                boxShadow: [BoxShadow(color: AC.green.withValues(alpha: 0.4), blurRadius: 24, offset: const Offset(0, 8))],
              ),
              alignment: Alignment.center,
              child: const Text('START', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: 0.06)),
            ),
          )
        else
          GestureDetector(
            onTap: _stopDetection,
            child: Container(
              width: 80, height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
                border: Border.all(color: Colors.white.withValues(alpha: 0.3), width: 4),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.45), blurRadius: 20)],
              ),
              alignment: Alignment.center,
              child: Container(width: 24, height: 24, decoration: BoxDecoration(color: Colors.black, borderRadius: BorderRadius.circular(5))),
            ),
          ),

        // ADD circle (right) — pushes current word to sentence
        Column(mainAxisSize: MainAxisSize.min, children: [
          Text('ADD',
              style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, letterSpacing: 0.1,
                  color: _detecting ? Colors.white.withValues(alpha: 0.45) : AC.inkFaint)),
          const SizedBox(height: 7),
          GestureDetector(
            onTap: _currentWord.isNotEmpty ? _addWord : null,
            child: Container(
              width: 56, height: 56,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _currentWord.isNotEmpty
                    ? (_detecting ? Colors.white : AC.green)
                    : (_detecting ? Colors.white.withValues(alpha: 0.08) : AC.surface2),
                border: Border.all(
                    color: _detecting ? Colors.white.withValues(alpha: 0.2) : AC.line, width: 2),
              ),
              alignment: Alignment.center,
              child: Text(
                '＋',
                style: TextStyle(
                  fontSize: 22, height: 1,
                  color: _currentWord.isNotEmpty
                      ? (_detecting ? Colors.black : Colors.white)
                      : (_detecting ? Colors.white.withValues(alpha: 0.3) : AC.inkFaint),
                ),
              ),
            ),
          ),
        ]),
      ],
    ),
  );

  // ─────────────────────────────────────────────────────────────────────────
  Widget _glassBtn(IconData icon, VoidCallback? onTap) => GestureDetector(
    onTap: onTap,
    child: Container(
      width: 38, height: 38,
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.35),
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
      ),
      child: Icon(icon, color: Colors.white, size: 19),
    ),
  );

  Widget _pillToggle(String label, bool on, VoidCallback onTap) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: on ? Colors.white : Colors.black.withValues(alpha: 0.4),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: on ? Colors.transparent : Colors.white.withValues(alpha: 0.2)),
      ),
      child: Text('$label ${on ? "ON" : "OFF"}',
          style: TextStyle(
              fontSize: 11.5, fontWeight: FontWeight.w700,
              color: on ? Colors.black : Colors.white.withValues(alpha: 0.85))),
    ),
  );

  Widget _actionPill(IconData icon, String label, {required VoidCallback onTap}) =>
      GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.18),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            Icon(icon, size: 13, color: Colors.white),
            const SizedBox(width: 4),
            Text(label, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700)),
          ]),
        ),
      );
}
