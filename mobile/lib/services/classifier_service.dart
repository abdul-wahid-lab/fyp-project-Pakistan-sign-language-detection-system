import 'dart:convert';
import 'dart:math';
import 'package:flutter/services.dart';
import 'package:tflite_flutter/tflite_flutter.dart';

/// Mirrors the Python preprocessing exactly:
/// removePoints → scalePoints (ref=50, ×2) → centerPoints (ref=150,150)
/// → StandardScaler → TFLite → argmax → label
class ClassifierService {
  Interpreter? _alphaInterp;
  Interpreter? _wordInterp;
  List<double> _alphaMean = [], _alphaScale = [];
  List<double> _wordMean  = [], _wordScale  = [];
  List<String> _alphaLabels = [], _wordLabels = [];

  bool get isReady => _alphaInterp != null && _wordInterp != null;

  Future<void> init() async {
    _alphaInterp = await Interpreter.fromAsset('assets/models/alphabet_model.tflite');
    _wordInterp  = await Interpreter.fromAsset('assets/models/word_model.tflite');

    final asc = jsonDecode(await rootBundle.loadString('assets/models/alphabet_scaler.json'));
    _alphaMean  = List<double>.from(asc['mean']);
    _alphaScale = List<double>.from(asc['scale']);

    final wsc = jsonDecode(await rootBundle.loadString('assets/models/word_scaler.json'));
    _wordMean  = List<double>.from(wsc['mean']);
    _wordScale = List<double>.from(wsc['scale']);

    _alphaLabels = List<String>.from(
        jsonDecode(await rootBundle.loadString('assets/models/alphabet_labels.json')));
    _wordLabels = List<String>.from(
        jsonDecode(await rootBundle.loadString('assets/models/word_labels.json')));
  }

  /// [landmarks] 42 normalised floats from MediaPipe.
  /// [mode] 0 = alphabet, 1 = words.
  /// Returns (label, confidence) or null if detection fails.
  ({String label, double confidence})? predict(List<double> landmarks, int imgW, int imgH, int mode) {
    if (!isReady) return null;

    // Denormalise to pixel coords
    final pts = List<double>.generate(
        42, (i) => i.isEven ? landmarks[i] * imgW : landmarks[i] * imgH);

    if (pts.where((v) => v != 0).length < 10) return null;

    // Distance: wrist (pt0) → middle-finger MCP (pt9 = index 18,19 in flat array)
    final dist = sqrt(pow(pts[0] - pts[18], 2) + pow(pts[1] - pts[19], 2));
    if (dist == 0) return null;

    // scalePoints: scale=(50/dist)*2
    final sf = (50.0 / dist) * 2.0;
    final scaled = pts.map((v) => v * sf).toList();

    // centerPoints: shift so wrist is at (150, 150)
    final dx = scaled[0] - 150.0;
    final dy = scaled[1] - 150.0;
    final centered = List<double>.generate(
        42, (i) => i.isEven ? scaled[i] - dx : scaled[i] - dy);

    // StandardScaler
    final mean  = mode == 0 ? _alphaMean  : _wordMean;
    final scale = mode == 0 ? _alphaScale : _wordScale;
    final features = List<double>.generate(
        42, (i) => (centered[i] - mean[i]) / scale[i]);

    // TFLite inference
    final interp  = mode == 0 ? _alphaInterp! : _wordInterp!;
    final labels  = mode == 0 ? _alphaLabels  : _wordLabels;
    final input   = [features];
    final output  = [List<double>.filled(labels.length, 0.0)];
    interp.run(input, output);

    // argmax + confidence
    final probs = output[0];
    int best = 0;
    for (int i = 1; i < probs.length; i++) {
      if (probs[i] > probs[best]) best = i;
    }
    return (label: labels[best], confidence: probs[best].clamp(0.0, 1.0));
  }

  void dispose() {
    _alphaInterp?.close();
    _wordInterp?.close();
  }
}
