import 'package:flutter_tts/flutter_tts.dart';

class TtsService {
  final _tts = FlutterTts();
  bool _urdu = true;

  Future<void> init() async {
    await _tts.setVolume(1.0);
    await _tts.setSpeechRate(0.5);
    await _setLang();
  }

  void setUrdu(bool urdu) { _urdu = urdu; _setLang(); }

  Future<void> speak(String text) => _tts.speak(text);
  Future<void> stop()            => _tts.stop();

  Future<void> _setLang() =>
      _tts.setLanguage(_urdu ? 'ur-PK' : 'en-US');

  void dispose() => _tts.stop();
}
