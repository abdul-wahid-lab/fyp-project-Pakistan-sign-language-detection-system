import 'package:flutter/material.dart';

class AC {
  // brand accents — same as website CSS vars
  static const green      = Color(0xFF2ECC71);
  static const greenDeep  = Color(0xFF1A8A4A);
  static const violet     = Color(0xFF8B5CF6);
  static const sky        = Color(0xFF3B82F6);
  static const coral      = Color(0xFFEF4444);
  static const amber      = Color(0xFFF59E0B);

  // surfaces — pure black like the website
  static const bg         = Color(0xFF000000);  // --bg: #000
  static const surface    = Color(0xFF111111);  // --bg-card: #111
  static const surface2   = Color(0xFF1C1C1E);  // nested surfaces
  static const line       = Color(0xFF222222);  // --border
  static const ink        = Colors.white;
  static const inkSoft    = Color(0xFF9CA3AF);
  static const inkFaint   = Color(0xFF6B7280);

  // soft tints (matching website --color-soft vars)
  static const greenSoft  = Color(0xFF052E16);
  static const violetSoft = Color(0xFF2E1B5B);
  static const skySoft    = Color(0xFF1E3A5F);
  static const coralSoft  = Color(0xFF4C1515);
  static const amberSoft  = Color(0xFF451A03);

  static Color soft(String color) {
    switch (color) {
      case 'green':  return greenSoft;
      case 'violet': return violetSoft;
      case 'sky':    return skySoft;
      case 'coral':  return coralSoft;
      case 'amber':  return amberSoft;
      default:       return greenSoft;
    }
  }

  static Color accent(String color) {
    switch (color) {
      case 'green':  return green;
      case 'violet': return violet;
      case 'sky':    return sky;
      case 'coral':  return coral;
      case 'amber':  return amber;
      default:       return green;
    }
  }

  static LinearGradient get gradGreen => const LinearGradient(
    colors: [green, greenDeep],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
