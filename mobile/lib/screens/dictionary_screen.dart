import 'package:flutter/material.dart';
import '../app_colors.dart';

const _ALPHA_DATA = [
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

const _WORDS_DATA = [
  (ur: 'السلام علیکم', en: 'Hello / Peace', idx: 1),
  (ur: 'اللہ حافظ',    en: 'Goodbye',       idx: 2),
  (ur: 'باپ',           en: 'Father',         idx: 3),
  (ur: 'ماں',           en: 'Mother',         idx: 4),
  (ur: 'میں',           en: 'I / Me',         idx: 5),
];

enum _View { home, alphabet, words }

class DictionaryScreen extends StatefulWidget {
  const DictionaryScreen({super.key});
  @override
  State<DictionaryScreen> createState() => _DictionaryScreenState();
}

class _DictionaryScreenState extends State<DictionaryScreen> {
  _View _view = _View.home;
  final _ctrl = TextEditingController();
  String _query = '';
  ({String c, String n, String u, int idx})? _selAlpha;
  ({String ur, String en, int idx})?           _selWord;

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  List<({String c, String n, String u, int idx})> get _filteredAlpha {
    final q = _query.trim().toLowerCase();
    if (q.isEmpty) return _ALPHA_DATA.toList();
    return _ALPHA_DATA.where((a) =>
        a.c.contains(_query.trim()) || a.n.toLowerCase().contains(q) ||
        a.u.contains(_query.trim())).toList();
  }

  List<({String ur, String en, int idx})> get _filteredWords {
    final q = _query.trim().toLowerCase();
    if (q.isEmpty) return _WORDS_DATA.toList();
    return _WORDS_DATA.where((w) =>
        w.ur.contains(_query.trim()) || w.en.toLowerCase().contains(q)).toList();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: AC.bg,
    body: Stack(children: [
      SafeArea(child: switch (_view) {
        _View.home     => _homeView(),
        _View.alphabet => _alphaView(),
        _View.words    => _wordsView(),
      }),
      if (_selAlpha != null) _alphaModal(),
      if (_selWord  != null) _wordModal(),
    ]),
  );

  Widget _homeView() => SingleChildScrollView(
    padding: const EdgeInsets.fromLTRB(18, 14, 18, 24),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const Text('PSL Dictionary',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AC.ink)),
      const SizedBox(height: 6),
      const Text('Explore Pakistan Sign Language — alphabet and words',
          style: TextStyle(fontSize: 13.5, color: AC.inkFaint)),
      const SizedBox(height: 22),
      GridView.count(
        crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12,
        shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
        childAspectRatio: 1.3,
        children: [
          _CatCard(
            icon: const Text('ا', style: TextStyle(fontSize: 40, fontWeight: FontWeight.w800, color: AC.green, height: 1)),
            title: 'Urdu Alphabet', sub: '37 signs',
            onTap: () => setState(() { _view = _View.alphabet; _query = ''; _ctrl.clear(); }),
          ),
          _CatCard(
            icon: const Icon(Icons.chat_bubble_outline_rounded, size: 36, color: AC.violet),
            title: 'Words', sub: '5 signs',
            onTap: () => setState(() { _view = _View.words; _query = ''; _ctrl.clear(); }),
          ),
        ],
      ),
    ]),
  );

  Widget _alphaView() => Column(children: [
    _subHeader('Urdu Alphabet', '${_filteredAlpha.length} of ${_ALPHA_DATA.length}', 'Search ب or Jeem…'),
    Expanded(child: _filteredAlpha.isEmpty ? _emptySearch() : GridView.count(
      padding: const EdgeInsets.fromLTRB(18, 8, 18, 24),
      crossAxisCount: 3, crossAxisSpacing: 10, mainAxisSpacing: 10, childAspectRatio: 0.8,
      children: _filteredAlpha.map((item) => GestureDetector(
        onTap: () => setState(() => _selAlpha = item),
        child: Container(
          decoration: BoxDecoration(color: AC.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AC.line)),
          padding: const EdgeInsets.all(10),
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            Text(item.c, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w700, color: AC.ink, height: 1)),
            const SizedBox(height: 8),
            Image.asset('assets/images/alphabet/${item.idx}.png', width: 68, height: 68, fit: BoxFit.contain,
                errorBuilder: (_, __, ___) => const Icon(Icons.sign_language_rounded, size: 40, color: AC.inkFaint)),
            const SizedBox(height: 8),
            Text(item.u, style: const TextStyle(fontSize: 11, color: AC.ink), textDirection: TextDirection.rtl),
            Text(item.n, style: const TextStyle(fontSize: 10, color: AC.inkFaint), overflow: TextOverflow.ellipsis),
          ]),
        ),
      )).toList(),
    )),
  ]);

  Widget _wordsView() => Column(children: [
    _subHeader('Words', '${_filteredWords.length} of ${_WORDS_DATA.length}', 'Search word…'),
    Expanded(child: _filteredWords.isEmpty ? _emptySearch() : GridView.count(
      padding: const EdgeInsets.fromLTRB(18, 8, 18, 24),
      crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12, childAspectRatio: 0.85,
      children: _filteredWords.map((word) => GestureDetector(
        onTap: () => setState(() => _selWord = word),
        child: Container(
          decoration: BoxDecoration(color: AC.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AC.line)),
          padding: const EdgeInsets.all(14),
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            Text(word.ur, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AC.ink, height: 1.3),
                textDirection: TextDirection.rtl, textAlign: TextAlign.center),
            const SizedBox(height: 10),
            Image.asset('assets/images/words/${word.idx}.png', width: 100, height: 100, fit: BoxFit.contain,
                errorBuilder: (_, __, ___) => const Icon(Icons.sign_language_rounded, size: 60, color: AC.inkFaint)),
            const SizedBox(height: 8),
            Text(word.en, style: const TextStyle(fontSize: 12, color: AC.inkFaint)),
          ]),
        ),
      )).toList(),
    )),
  ]);

  Widget _subHeader(String title, String count, String placeholder) =>
      Padding(padding: const EdgeInsets.fromLTRB(18, 14, 18, 0), child: Column(children: [
        Row(children: [
          GestureDetector(
            onTap: () => setState(() { _view = _View.home; _query = ''; _ctrl.clear(); }),
            child: const Row(mainAxisSize: MainAxisSize.min, children: [
              Icon(Icons.arrow_back_ios_rounded, size: 14, color: AC.inkSoft),
              Text('Dictionary', style: TextStyle(fontSize: 13, color: AC.inkSoft, fontWeight: FontWeight.w600)),
            ]),
          ),
          const Text(' / ', style: TextStyle(color: AC.inkFaint, fontSize: 13)),
          Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AC.ink)),
          const Spacer(),
          Text(count, style: const TextStyle(fontSize: 12, color: AC.inkFaint)),
        ]),
        const SizedBox(height: 12),
        Container(
          height: 42,
          decoration: BoxDecoration(color: AC.surface2, borderRadius: BorderRadius.circular(12), border: Border.all(color: AC.line)),
          child: Row(children: [
            const SizedBox(width: 12),
            const Icon(Icons.search_rounded, size: 17, color: AC.inkFaint),
            const SizedBox(width: 8),
            Expanded(child: TextField(
              controller: _ctrl, onChanged: (v) => setState(() => _query = v),
              style: const TextStyle(color: AC.ink, fontSize: 14),
              decoration: InputDecoration(hintText: placeholder,
                  hintStyle: const TextStyle(color: AC.inkFaint, fontSize: 14),
                  border: InputBorder.none, isDense: true),
            )),
            if (_query.isNotEmpty)
              GestureDetector(
                onTap: () { _ctrl.clear(); setState(() => _query = ''); },
                child: const Padding(padding: EdgeInsets.symmetric(horizontal: 10),
                    child: Icon(Icons.close_rounded, size: 16, color: AC.inkFaint)),
              ),
          ]),
        ),
        const SizedBox(height: 8),
      ]));

  Widget _emptySearch() => Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
    const Icon(Icons.search_off_rounded, size: 36, color: AC.inkFaint),
    const SizedBox(height: 10),
    Text('No sign found for "$_query"', style: const TextStyle(fontSize: 14, color: AC.inkFaint)),
  ]));

  Widget _alphaModal() {
    final item = _selAlpha!;
    return _modal(onClose: () => setState(() => _selAlpha = null), child: Column(mainAxisSize: MainAxisSize.min, children: [
      Text(item.c, style: const TextStyle(fontSize: 72, fontWeight: FontWeight.w800, color: AC.ink, height: 1)),
      const SizedBox(height: 14),
      Image.asset('assets/images/alphabet/${item.idx}.png', width: 200, height: 200, fit: BoxFit.contain,
          errorBuilder: (_, __, ___) => const Icon(Icons.sign_language_rounded, size: 100, color: AC.inkFaint)),
      const SizedBox(height: 14),
      Text(item.u, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AC.ink), textDirection: TextDirection.rtl),
      const SizedBox(height: 4),
      Text(item.n, style: const TextStyle(fontSize: 13, color: AC.inkSoft)),
      const SizedBox(height: 6),
      Text('Sign ${item.idx} of ${_ALPHA_DATA.length}', style: const TextStyle(fontSize: 11, color: AC.inkFaint)),
    ]));
  }

  Widget _wordModal() {
    final word = _selWord!;
    return _modal(onClose: () => setState(() => _selWord = null), child: Column(mainAxisSize: MainAxisSize.min, children: [
      Text(word.ur, style: const TextStyle(fontSize: 38, fontWeight: FontWeight.w800, color: AC.ink, height: 1.3),
          textDirection: TextDirection.rtl, textAlign: TextAlign.center),
      const SizedBox(height: 14),
      Image.asset('assets/images/words/${word.idx}.png', width: 200, height: 200, fit: BoxFit.contain,
          errorBuilder: (_, __, ___) => const Icon(Icons.sign_language_rounded, size: 100, color: AC.inkFaint)),
      const SizedBox(height: 14),
      Text(word.en, style: const TextStyle(fontSize: 15, color: AC.inkSoft, fontWeight: FontWeight.w500)),
    ]));
  }

  Widget _modal({required VoidCallback onClose, required Widget child}) =>
      GestureDetector(
        onTap: onClose,
        child: Container(color: Colors.black.withValues(alpha: 0.65),
          child: Center(child: GestureDetector(onTap: () {},
            child: Container(
              margin: const EdgeInsets.all(28),
              padding: const EdgeInsets.fromLTRB(28, 18, 28, 28),
              decoration: BoxDecoration(color: AC.surface, borderRadius: BorderRadius.circular(24), border: Border.all(color: AC.line)),
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                Align(alignment: Alignment.topRight,
                    child: GestureDetector(onTap: onClose,
                        child: const Icon(Icons.close_rounded, color: AC.inkFaint, size: 22))),
                const SizedBox(height: 4),
                child,
              ]),
            ),
          )),
        ),
      );
}

class _CatCard extends StatelessWidget {
  final Widget icon;
  final String title, sub;
  final VoidCallback onTap;
  const _CatCard({required this.icon, required this.title, required this.sub, required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.fromLTRB(18, 22, 18, 18),
      decoration: BoxDecoration(color: AC.surface, borderRadius: BorderRadius.circular(18), border: Border.all(color: AC.line)),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        SizedBox(height: 50, child: Center(child: icon)),
        const SizedBox(height: 10),
        Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AC.ink)),
        const SizedBox(height: 3),
        Text(sub, style: const TextStyle(fontSize: 12, color: AC.inkFaint)),
      ]),
    ),
  );
}
