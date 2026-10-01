import 'dart:math';
import 'package:flutter/material.dart';
import '../app_colors.dart';

class ProgressRing extends StatelessWidget {
  final double pct;   // 0–100
  final double size;
  final String color;
  final Widget? child;

  const ProgressRing({
    super.key,
    required this.pct,
    required this.size,
    required this.color,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size, height: size,
      child: Stack(alignment: Alignment.center, children: [
        CustomPaint(
          size: Size(size, size),
          painter: _RingPainter(pct / 100, AC.accent(color)),
        ),
        if (child != null) child!,
      ]),
    );
  }
}

class _RingPainter extends CustomPainter {
  final double progress;
  final Color color;
  const _RingPainter(this.progress, this.color);

  @override
  void paint(Canvas canvas, Size size) {
    final c = Offset(size.width / 2, size.height / 2);
    final r = size.width / 2 - 4;
    final track = Paint()
      ..color = AC.line
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke;
    final fill = Paint()
      ..color = color
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawCircle(c, r, track);
    canvas.drawArc(
      Rect.fromCircle(center: c, radius: r),
      -pi / 2,
      2 * pi * progress,
      false,
      fill,
    );
  }

  @override
  bool shouldRepaint(_RingPainter old) => old.progress != progress;
}
