import 'package:flutter/material.dart';
import '../app_colors.dart';

class UrduChip extends StatelessWidget {
  final String character;
  final String color;
  final double size;

  const UrduChip({
    super.key,
    required this.character,
    required this.color,
    this.size = 46,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size, height: size,
      decoration: BoxDecoration(
        color: AC.soft(color),
        borderRadius: BorderRadius.circular(size * 0.3),
      ),
      alignment: Alignment.center,
      child: Text(
        character,
        style: TextStyle(
          fontSize: size * 0.48,
          color: AC.accent(color),
          fontWeight: FontWeight.w700,
          height: 1,
        ),
      ),
    );
  }
}
