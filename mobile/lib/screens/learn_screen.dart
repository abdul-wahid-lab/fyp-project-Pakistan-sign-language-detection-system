import 'package:flutter/material.dart';
import '../app_colors.dart';

// 37 PSL letters — index matches image filename (1-37)
const _ALPHA = [
  (c: 'ء', n: 'Hamza',       u: 'ہمزہ',     idx: 1 ),
  (c: 'ا', n: 'Alif',        u: 'الف',       idx: 2 ),
  (c: 'ب', n: 'Be',          u: 'بے',        idx: 3 ),
  (c: 'ت', n: 'Te',          u: 'تے',        idx: 4 ),
  (c: 'ث', n: 'Se',          u: 'ثے',        idx: 5 ),
  (c: 'ج', n: 'Jeem',        u: 'جیم',       idx: 6 ),
  (c: 'ح', n: 'Baṛī He',     u: 'بڑی حے',   idx: 7 ),
  (c: 'خ', n: 'Khe',         u: 'خے',        idx: 8 ),
  (c: 'د', n: 'Dal',         u: 'دال',       idx: 9 ),
  (c: 'ذ', n: 'Zal',         u: 'ذال',       idx: 10),
  (c: 'ر', n: 'Re',          u: 'رے',        idx: 11),
  (c: 'ز', n: 'Ze',          u: 'زے',        idx: 12),
  (c: 'س', n: 'Seen',        u: 'سین',       idx: 13),
  (c: 'ش', n: 'Sheen',       u: 'شین',       idx: 14),
  (c: 'ص', n: 'Suad',        u: 'صواد',      idx: 15),
  (c: 'ض', n: 'Zuad',        u: 'ضواد',      idx: 16),
  (c: 'ط', n: 'Toe',         u: 'طوے',       idx: 17),
  (c: 'ظ', n: 'Zoe',         u: 'ظوے',       idx: 18),
  (c: 'ع', n: 'Ain',         u: 'عین',       idx: 19),
  (c: 'غ', n: 'Ghain',       u: 'غین',       idx: 20),
  (c: 'ف', n: 'Fe',          u: 'فے',        idx: 21),
  (c: 'ق', n: 'Qaf',         u: 'قاف',       idx: 22),
  (c: 'ل', n: 'Lam',         u: 'لام',       idx: 23),
  (c: 'م', n: 'Meem',        u: 'میم',       idx: 24),
  (c: 'ن', n: 'Noon',        u: 'نون',       idx: 25),
  (c: 'و', n: 'Wao',         u: 'واؤ',       idx: 26),
  (c: 'ٹ', n: 'Ṭe',          u: 'ٹے',        idx: 27),
  (c: 'پ', n: 'Pe',          u: 'پے',        idx: 28),
  (c: 'چ', n: 'Che',         u: 'چے',        idx: 29),
  (c: 'ڈ', n: 'Ḍal',         u: 'ڈال',       idx: 30),
  (c: 'ژ', n: 'Zhe',         u: 'ژے',        idx: 31),
  (c: 'ک', n: 'Kaf',         u: 'کاف',       idx: 32),
  (c: 'گ', n: 'Gaf',         u: 'گاف',       idx: 33),
  (c: 'ں', n: 'Noon Ghunna', u: 'نون غنہ',  idx: 34),
  (c: 'ھ', n: 'Choṭī He',    u: 'چھوٹی ہے', idx: 35),
  (c: 'ی', n: 'Ye',          u: 'یے',        idx: 36),
  (c: 'ے', n: 'Baṛī Ye',    u: 'بڑی یے',  idx: 37),
];

const _QUIZ = [
  (img: 'assets/images/words/1.png', ur: 'السلام علیکم', opts: ['السلام علیکم', 'اللہ حافظ', 'باپ', 'ماں']),
  (img: 'assets/images/words/2.png', ur: 'اللہ حافظ',    opts: ['میں', 'باپ', 'اللہ حافظ', 'السلام علیکم']),
  (img: 'assets/images/words/3.png', ur: 'باپ',           opts: ['ماں', 'باپ', 'میں', 'اللہ حافظ']),
  (img: 'assets/images/words/4.png', ur: 'ماں',           opts: ['باپ', 'السلام علیکم', 'میں', 'ماں']),
  (img: 'assets/images/words/5.png', ur: 'میں',           opts: ['اللہ حافظ', 'میں', 'باپ', 'ماں']),
];

const _COLORS = ['green', 'coral', 'violet', 'sky', 'amber'];

class LearnScreen extends StatefulWidget {
  const LearnScreen({super.key});
  @override
  State<LearnScreen> createState() => _LearnScreenState();
}

class _LearnScreenState extends State<LearnScreen> {
  int _quizIdx = 0;
  String? _picked;
  int _score = 0;
  ({String c, String n, String u, int idx})? _expanded;

  void _pick(String opt) {
    if (_picked != null) return;
    setState(() {
      _picked = opt;
      if (opt == _QUIZ[_quizIdx].ur) _score++;
    });
  }

  void _nextQ() => setState(() { _picked = null; _quizIdx = (_quizIdx + 1) % _QUIZ.length; });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AC.bg,
      body: Stack(children: [
        SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(18, 14, 18, 24),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

              // ── Header ───────────────────────────────────
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                const Text('Learn PSL',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AC.ink)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 5),
                  decoration: BoxDecoration(color: AC.violetSoft, borderRadius: BorderRadius.circular(999)),
                  child: const Text('37 letters · 5 words',
                      style: TextStyle(color: AC.violet, fontSize: 11.5, fontWeight: FontWeight.w700)),
                ),
              ]),
              const SizedBox(height: 6),
              const Text('Bite-sized lessons, quizzes and practice',
                  style: TextStyle(color: AC.inkFaint, fontSize: 13.5)),
              const SizedBox(height: 20),

              // ── Lesson cards ──────────────────────────────
              const Text('Your learning path',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AC.ink)),
              const SizedBox(height: 12),
              Row(children: [
                Expanded(child: _LessonCard(
                  icon: Icons.sign_language_rounded, color: 'green',
                  title: 'The PSL Alphabet', sub: '37 letters',
                )),
                const SizedBox(width: 12),
                Expanded(child: _LessonCard(
                  icon: Icons.chat_bubble_outline_rounded, color: 'violet',
                  title: 'PSL Words', sub: '5 words',
                )),
              ]),
              const SizedBox(height: 24),

              // ── Alphabet practice ─────────────────────────
              _Card(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: AC.greenSoft, borderRadius: BorderRadius.circular(999)),
                  child: const Row(mainAxisSize: MainAxisSize.min, children: [
                    Icon(Icons.sign_language_rounded, size: 13, color: AC.green),
                    SizedBox(width: 5),
                    Text('Alphabet practice',
                        style: TextStyle(color: AC.green, fontSize: 11.5, fontWeight: FontWeight.w700)),
                  ]),
                ),
                const SizedBox(height: 12),
                const Text('All 37 PSL letters',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AC.ink)),
                const SizedBox(height: 4),
                const Text('Tap a letter to see its handshape',
                    style: TextStyle(color: AC.inkFaint, fontSize: 13)),
                const SizedBox(height: 14),
                GridView.count(
                  crossAxisCount: 5,
                  crossAxisSpacing: 8, mainAxisSpacing: 8,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  children: _ALPHA.asMap().entries.map((e) {
                    final sign = e.value;
                    final color = _COLORS[e.key % 5];
                    return GestureDetector(
                      onTap: () => setState(() => _expanded = sign),
                      child: Container(
                        decoration: BoxDecoration(
                          color: AC.surface2,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AC.line),
                        ),
                        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                          Text(sign.c,
                              style: TextStyle(fontSize: 22, color: AC.accent(color),
                                  fontWeight: FontWeight.w700, height: 1)),
                          const SizedBox(height: 4),
                          Icon(Icons.sign_language_rounded, size: 11, color: AC.inkFaint),
                        ]),
                      ),
                    );
                  }).toList(),
                ),
              ])),
              const SizedBox(height: 18),

              // ── Quiz ─────────────────────────────────────
              _buildQuiz(),
            ]),
          ),
        ),

        // ── Letter detail overlay ─────────────────────────
        if (_expanded != null)
          GestureDetector(
            onTap: () => setState(() => _expanded = null),
            child: Container(
              color: Colors.black.withValues(alpha: 0.7),
              child: Center(
                child: GestureDetector(
                  onTap: () {},
                  child: Container(
                    margin: const EdgeInsets.all(32),
                    padding: const EdgeInsets.fromLTRB(28, 20, 28, 24),
                    decoration: BoxDecoration(
                      color: AC.surface,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: AC.line),
                    ),
                    child: Column(mainAxisSize: MainAxisSize.min, children: [
                      Align(
                        alignment: Alignment.topRight,
                        child: GestureDetector(
                          onTap: () => setState(() => _expanded = null),
                          child: const Icon(Icons.close_rounded, color: AC.inkFaint, size: 22),
                        ),
                      ),
                      Text(_expanded!.c,
                          style: const TextStyle(fontSize: 72, fontWeight: FontWeight.w800,
                              color: AC.ink, height: 1)),
                      const SizedBox(height: 14),
                      Image.asset(
                        'assets/images/alphabet/${_expanded!.idx}.png',
                        width: 200, height: 200, fit: BoxFit.contain,
                        errorBuilder: (_, __, ___) => const SizedBox(
                          width: 200, height: 200,
                          child: Icon(Icons.sign_language_rounded, size: 80, color: AC.inkFaint),
                        ),
                      ),
                      const SizedBox(height: 14),
                      Text(_expanded!.u,
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AC.ink),
                          textDirection: TextDirection.rtl),
                      const SizedBox(height: 4),
                      Text(_expanded!.n, style: const TextStyle(fontSize: 13, color: AC.inkSoft)),
                      const SizedBox(height: 6),
                      Text('Sign ${_expanded!.idx} of ${_ALPHA.length}',
                          style: const TextStyle(fontSize: 11, color: AC.inkFaint)),
                    ]),
                  ),
                ),
              ),
            ),
          ),
      ]),
    );
  }

  Widget _buildQuiz() {
    final q = _QUIZ[_quizIdx];
    final answered = _picked != null;
    return _Card(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(color: AC.coralSoft, borderRadius: BorderRadius.circular(999)),
          child: const Row(mainAxisSize: MainAxisSize.min, children: [
            Icon(Icons.track_changes_rounded, size: 13, color: AC.coral),
            SizedBox(width: 5),
            Text('Quick quiz',
                style: TextStyle(color: AC.coral, fontSize: 11.5, fontWeight: FontWeight.w700)),
          ]),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(color: AC.amberSoft, borderRadius: BorderRadius.circular(999)),
          child: Text('Score $_score/${_QUIZ.length}',
              style: const TextStyle(color: AC.amber, fontSize: 12, fontWeight: FontWeight.w700)),
        ),
      ]),
      const SizedBox(height: 14),
      const Text('What does this sign mean?',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AC.ink)),
      const SizedBox(height: 4),
      Text('Question ${_quizIdx + 1} of ${_QUIZ.length}',
          style: const TextStyle(color: AC.inkFaint, fontSize: 13)),
      const SizedBox(height: 14),
      ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Image.asset(q.img, width: double.infinity, fit: BoxFit.fitWidth,
            errorBuilder: (_, __, ___) => Container(
              height: 160, color: AC.surface2,
              child: const Center(child: Icon(Icons.sign_language_rounded,
                  size: 60, color: AC.inkFaint)),
            )),
      ),
      const SizedBox(height: 14),
      GridView.count(
        crossAxisCount: 2, crossAxisSpacing: 10, mainAxisSpacing: 10,
        shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
        childAspectRatio: 2.4,
        children: q.opts.map((opt) {
          Color bg = AC.surface2, border = Colors.transparent, fg = AC.ink;
          if (answered) {
            if (opt == q.ur)         { bg = AC.greenSoft; border = AC.green; }
            else if (opt == _picked) { bg = AC.coralSoft; border = AC.coral; }
          }
          return GestureDetector(
            onTap: () => _pick(opt),
            child: Container(
              decoration: BoxDecoration(
                color: bg, borderRadius: BorderRadius.circular(14),
                border: Border.all(color: border, width: 2),
              ),
              alignment: Alignment.center,
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(child: Text(opt,
                      textAlign: TextAlign.center,
                      textDirection: TextDirection.rtl,
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: fg))),
                  if (answered && opt == q.ur)
                    const Icon(Icons.check_rounded, color: AC.green, size: 18),
                  if (answered && opt == _picked && opt != q.ur)
                    const Icon(Icons.close_rounded, color: AC.coral, size: 18),
                ],
              ),
            ),
          );
        }).toList(),
      ),
      if (answered) ...[
        const SizedBox(height: 14),
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(
            _picked == q.ur ? '🎉 Correct!' : 'Correct: ${q.ur}',
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: _picked == q.ur ? AC.green : AC.inkSoft,
            ),
          ),
          GestureDetector(
            onTap: _nextQ,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(color: AC.green, borderRadius: BorderRadius.circular(999)),
              child: const Row(mainAxisSize: MainAxisSize.min, children: [
                Text('Next', style: TextStyle(color: Colors.white,
                    fontWeight: FontWeight.w700, fontSize: 13.5)),
                SizedBox(width: 5),
                Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 16),
              ]),
            ),
          ),
        ]),
      ],
    ]));
  }
}

class _LessonCard extends StatelessWidget {
  final IconData icon;
  final String color, title, sub;
  const _LessonCard({required this.icon, required this.color, required this.title, required this.sub});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(
      color: AC.surface, borderRadius: BorderRadius.circular(18), border: Border.all(color: AC.line),
    ),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Container(width: 48, height: 48,
            decoration: BoxDecoration(color: AC.soft(color), borderRadius: BorderRadius.circular(14)),
            child: Icon(icon, size: 24, color: AC.accent(color))),
        Text('Practice',
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AC.accent(color))),
      ]),
      const SizedBox(height: 12),
      Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AC.ink)),
      const SizedBox(height: 3),
      Text(sub, style: const TextStyle(fontSize: 12.5, color: AC.inkFaint)),
    ]),
  );
}

class _Card extends StatelessWidget {
  final Widget child;
  const _Card({required this.child});
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(20),
    decoration: BoxDecoration(
      color: AC.surface, borderRadius: BorderRadius.circular(18), border: Border.all(color: AC.line),
    ),
    child: child,
  );
}
