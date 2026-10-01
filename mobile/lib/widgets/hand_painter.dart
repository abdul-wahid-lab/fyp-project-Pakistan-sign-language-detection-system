import 'dart:ui' show PointMode;

import 'package:flutter/material.dart';
import '../data/psl_data.dart';

class HandPainter extends CustomPainter {
  final List<double> landmarks; // 42 normalised doubles
  final Size previewSize;

  const HandPainter(this.landmarks, this.previewSize);

  @override
  void paint(Canvas canvas, Size size) {
    if (landmarks.length < 42) return;

    final sx = size.width  / previewSize.width;
    final sy = size.height / previewSize.height;

    Offset pt(int i) => Offset(
      landmarks[i * 2]     * previewSize.width  * sx,
      landmarks[i * 2 + 1] * previewSize.height * sy,
    );

    final line = Paint()
      ..color = Colors.greenAccent.withValues(alpha: 0.85)
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    final dot = Paint()
      ..color = Colors.white
      ..strokeWidth = 6
      ..strokeCap = StrokeCap.round;

    for (final c in handConnections) {
      canvas.drawLine(pt(c[0]), pt(c[1]), line);
    }
    for (int i = 0; i < 21; i++) {
      canvas.drawPoints(PointMode.points, [pt(i)], dot);
    }
  }

  @override
  bool shouldRepaint(HandPainter old) => old.landmarks != landmarks;
}
