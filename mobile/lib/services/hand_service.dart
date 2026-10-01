import 'dart:typed_data';
import 'package:flutter/services.dart';

/// Sends a camera frame to the native MediaPipe HandLandmarker.
/// Returns 42 normalised doubles [x0,y0 … x20,y20] or null if no hand found.
class HandService {
  static const _ch = MethodChannel('linguasign/mediapipe');

  Future<List<double>?> detect({
    required Uint8List nv21Bytes,
    required int width,
    required int height,
    int rotation = 0,
  }) async {
    final res = await _ch.invokeMethod<List<dynamic>>('detectHand', {
      'bytes':    nv21Bytes,
      'width':    width,
      'height':   height,
      'rotation': rotation,
    });
    if (res == null || res.isEmpty) return null;
    return res.cast<double>();
  }
}
