import 'package:flutter/material.dart';
import '../app_colors.dart';
import '../widgets/hand_painter.dart';

class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key});
  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int _q = 4; // showing question 5
  int? _selected;
  final _opts = ['Hello', 'Thank you', 'Water', 'Friend'];
  final _correct = 1; // index of correct answer

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AC.bg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 6, 20, 0),
          child: Column(children: [
            // ── Progress row ──────────────────────────────
            Row(children: [
              GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Container(
                  width: 42, height: 42,
                  decoration: BoxDecoration(color: AC.surface, borderRadius: BorderRadius.circular(14)),
                  child: const Icon(Icons.close_rounded, size: 19, color: AC.inkSoft),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(9),
                  child: const LinearProgressIndicator(
                    value: 0.45,
                    backgroundColor: AC.surface2,
                    color: AC.green,
                    minHeight: 9,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(color: AC.coralSoft, borderRadius: BorderRadius.circular(999)),
                child: const Row(children: [
                  Icon(Icons.local_fire_department_rounded, size: 13, color: AC.coral),
                  SizedBox(width: 5),
                  Text('12', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AC.coral)),
                ]),
              ),
            ]),
            const SizedBox(height: 18),

            // ── Question label ────────────────────────────
            Align(
              alignment: Alignment.centerLeft,
              child: Text('QUESTION ${_q + 1} OF 10',
                  style: const TextStyle(
                    fontSize: 13.5, fontWeight: FontWeight.w700,
                    color: AC.violet, letterSpacing: 0.04,
                  )),
            ),
            const SizedBox(height: 6),
            const Align(
              alignment: Alignment.centerLeft,
              child: Text('What does this sign mean?',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AC.ink, height: 1.15)),
            ),
            const SizedBox(height: 18),

            // ── Sign preview ──────────────────────────────
            Container(
              height: 230,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF4FA8D5), Color(0xFF7B5EA7)],
                  begin: Alignment.topLeft, end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Stack(children: [
                Center(
                  child: SizedBox(
                    width: 130, height: 165,
                    child: CustomPaint(
                      painter: HandPainter(
                        List.generate(42, (i) => 0.5),
                        const Size(130, 165),
                      ),
                    ),
                  ),
                ),
                const Positioned(
                  top: 14, right: 18,
                  child: Text('شکریہ',
                      style: TextStyle(
                        fontFamily: 'serif', fontSize: 38,
                        color: Colors.white, fontWeight: FontWeight.w700,
                      )),
                ),
              ]),
            ),
            const SizedBox(height: 20),

            // ── Answer options ────────────────────────────
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 2.4,
                children: _opts.asMap().entries.map((e) {
                  final idx = e.key;
                  final isCorrect = idx == _correct;
                  final isSelected = _selected == idx;
                  Color bg = AC.surface2;
                  Color border = Colors.transparent;
                  Color text = AC.ink;
                  if (_selected != null && isCorrect) {
                    bg = AC.greenSoft;
                    border = AC.green;
                    text = AC.green;
                  } else if (isSelected && !isCorrect) {
                    bg = AC.coralSoft;
                    border = AC.coral;
                    text = AC.coral;
                  }
                  return GestureDetector(
                    onTap: () => setState(() => _selected = idx),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: bg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: border, width: 2),
                      ),
                      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                        Text(e.value,
                            style: TextStyle(
                              fontWeight: FontWeight.w600, fontSize: 16, color: text,
                            )),
                        if (_selected != null && isCorrect)
                          const Icon(Icons.check_rounded, color: AC.green, size: 20),
                      ]),
                    ),
                  );
                }).toList(),
              ),
            ),

            // ── Check button ──────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AC.green,
                    foregroundColor: Colors.white,
                    disabledBackgroundColor: AC.surface2,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: _selected != null ? () {} : null,
                  child: const Text('Check answer',
                      style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
                ),
              ),
            ),
          ]),
        ),
      ),
    );
  }
}
