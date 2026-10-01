import 'package:flutter/material.dart';
import '../app_colors.dart';
import '../services/classifier_service.dart';
import '../services/tts_service.dart';
import '../widgets/hand_painter.dart';
import 'auth_screen.dart';

class OnboardingScreen extends StatelessWidget {
  final ClassifierService classifier;
  final TtsService tts;
  const OnboardingScreen({super.key, required this.classifier, required this.tts});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(fit: StackFit.expand, children: [
        // green gradient bg
        Container(decoration: BoxDecoration(gradient: AC.gradGreen)),
        // radial shimmer
        Container(
          decoration: const BoxDecoration(
            gradient: RadialGradient(
              center: Alignment(0, -0.6),
              radius: 0.8,
              colors: [Color(0x1FFFFFFF), Colors.transparent],
            ),
          ),
        ),
        SafeArea(
          child: Column(children: [
            // skip
            Align(
              alignment: Alignment.centerRight,
              child: Padding(
                padding: const EdgeInsets.only(top: 4, right: 22),
                child: GestureDetector(
                  onTap: () => _goAuth(context),
                  child: const Text('Skip',
                      style: TextStyle(color: Colors.white70, fontWeight: FontWeight.w600, fontSize: 14)),
                ),
              ),
            ),
            // floating urdu chips + hand
            Expanded(
              child: Stack(children: [
                _floatChip('ا', 0.18, 0.16, const Color(0xFFEF4444)),
                _floatChip('ب', 0.30, 0.74, const Color(0xFF3B82F6)),
                _floatChip('ج', 0.64, 0.20, const Color(0xFF8B5CF6)),
                Center(
                  child: SizedBox(
                    width: 210, height: 250,
                    child: CustomPaint(
                      painter: HandPainter(
                        List.generate(42, (i) => i.isEven ? 0.5 : 0.5),
                        const Size(210, 250),
                      ),
                    ),
                  ),
                ),
              ]),
            ),
            // bottom sheet
            Container(
              decoration: const BoxDecoration(
                color: AC.surface,
                borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
              ),
              padding: const EdgeInsets.fromLTRB(26, 30, 26, 30),
              child: Column(children: [
                // dots
                Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  _dot(true), const SizedBox(width: 7), _dot(false), const SizedBox(width: 7), _dot(false),
                ]),
                const SizedBox(height: 22),
                RichText(
                  textAlign: TextAlign.center,
                  text: const TextSpan(
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AC.ink, height: 1.15),
                    children: [
                      TextSpan(text: 'Sign. Translate. '),
                      TextSpan(text: 'Connect.', style: TextStyle(color: AC.green)),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Turn Pakistan Sign Language into text and speech in real time — right from your phone.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: AC.inkSoft, fontSize: 15.5, height: 1.55),
                ),
                const SizedBox(height: 26),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AC.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    onPressed: () => _goAuth(context),
                    child: const Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                      Text('Get started', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
                      SizedBox(width: 8),
                      Icon(Icons.arrow_forward_rounded, size: 19),
                    ]),
                  ),
                ),
                const SizedBox(height: 16),
                GestureDetector(
                  onTap: () => _goAuth(context),
                  child: RichText(
                    text: const TextSpan(
                      style: TextStyle(fontSize: 14.5, color: AC.inkSoft),
                      children: [
                        TextSpan(text: 'Already have an account? '),
                        TextSpan(text: 'Log in',
                            style: TextStyle(color: AC.green, fontWeight: FontWeight.w700)),
                      ],
                    ),
                  ),
                ),
              ]),
            ),
          ]),
        ),
      ]),
    );
  }

  Widget _floatChip(String ch, double top, double left, Color color) {
    return Positioned(
      top: MediaQueryData.fromView(WidgetsBinding.instance.platformDispatcher.views.first).size.height * top,
      left: MediaQueryData.fromView(WidgetsBinding.instance.platformDispatcher.views.first).size.width * left,
      child: Container(
        width: 52, height: 52,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.18),
          borderRadius: BorderRadius.circular(16),
        ),
        alignment: Alignment.center,
        child: Text(ch,
            style: TextStyle(
              fontSize: 24, fontWeight: FontWeight.w700, color: Colors.white,
            )),
      ),
    );
  }

  Widget _dot(bool on) => AnimatedContainer(
    duration: const Duration(milliseconds: 200),
    width: on ? 24 : 8, height: 8,
    decoration: BoxDecoration(
      color: on ? AC.green : AC.line,
      borderRadius: BorderRadius.circular(9),
    ),
  );

  void _goAuth(BuildContext ctx) =>
      Navigator.pushReplacement(ctx, MaterialPageRoute(builder: (_) => AuthScreen(classifier: classifier, tts: tts)));
}
