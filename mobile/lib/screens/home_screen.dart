import 'package:flutter/material.dart';
import '../app_colors.dart';
import '../services/history_service.dart';

class HomeScreen extends StatefulWidget {
  final VoidCallback? onDetectTap;
  const HomeScreen({super.key, this.onDetectTap});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _streak = 0, _total = 0;
  List<({String day, int count, bool isToday})> _week = [];
  List<HistoryEntry> _history = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final streak  = await HistoryService.getStreak();
    final total   = await HistoryService.getTotalSigns();
    final week    = await HistoryService.getWeek();
    final history = await HistoryService.getHistory();
    if (mounted) {
      setState(() {
        _streak = streak; _total = total; _week = week;
        _history = history.take(8).toList();
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AC.bg,
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AC.green))
          : RefreshIndicator(
              color: AC.green,
              backgroundColor: AC.surface,
              onRefresh: _load,
              child: SafeArea(
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(18, 14, 18, 24),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

                    // ── Header ────────────────────────────────
                    Row(children: [
                      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text('Salaam 👋',
                            style: TextStyle(fontSize: 13, color: AC.inkFaint, fontWeight: FontWeight.w600)),
                        const Text('LinguaSign',
                            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AC.ink)),
                      ])),
                      GestureDetector(
                        onTap: widget.onDetectTap,
                        child: Container(
                          height: 38, padding: const EdgeInsets.symmetric(horizontal: 14),
                          decoration: BoxDecoration(
                            color: AC.green,
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: const Row(mainAxisSize: MainAxisSize.min, children: [
                            Icon(Icons.camera_alt_rounded, size: 16, color: Colors.white),
                            SizedBox(width: 7),
                            Text('Detect', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 13.5)),
                          ]),
                        ),
                      ),
                    ]),
                    const SizedBox(height: 20),

                    // ── Stat chips ────────────────────────────
                    Row(children: [
                      Expanded(child: _StatCard(icon: Icons.local_fire_department_rounded, color: AC.coral, soft: AC.coralSoft, value: '$_streak', label: 'Day streak')),
                      const SizedBox(width: 12),
                      Expanded(child: _StatCard(icon: Icons.sign_language_rounded, color: AC.green, soft: AC.greenSoft, value: '$_total', label: 'Signs detected')),
                    ]),
                    const SizedBox(height: 18),

                    // ── Weekly activity ───────────────────────
                    _Card(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                        const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text('Weekly activity', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 17, color: AC.ink)),
                          SizedBox(height: 2),
                          Text('Signs detected per day', style: TextStyle(color: AC.inkFaint, fontSize: 12.5)),
                        ]),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: AC.greenSoft, borderRadius: BorderRadius.circular(999)),
                          child: const Text('This week', style: TextStyle(color: AC.green, fontSize: 11, fontWeight: FontWeight.w700)),
                        ),
                      ]),
                      const SizedBox(height: 18),
                      _weekChart(),
                      const SizedBox(height: 20),
                      // CTA row
                      GestureDetector(
                        onTap: widget.onDetectTap,
                        child: Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(color: AC.surface2, borderRadius: BorderRadius.circular(14)),
                          child: Row(children: [
                            Container(
                              width: 42, height: 42,
                              decoration: BoxDecoration(color: AC.greenSoft, borderRadius: BorderRadius.circular(13)),
                              child: const Icon(Icons.sign_language_rounded, color: AC.green, size: 22),
                            ),
                            const SizedBox(width: 12),
                            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Text(_total == 0 ? 'Start your first session' : 'Keep practising PSL',
                                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14.5, color: AC.ink)),
                              Text(_total == 0 ? '37 letters · 5 words' : '$_total signs detected so far',
                                  style: const TextStyle(fontSize: 12, color: AC.inkFaint)),
                            ])),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                              decoration: BoxDecoration(color: AC.surface, borderRadius: BorderRadius.circular(10), border: Border.all(color: AC.line)),
                              child: const Text('Practise', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AC.ink)),
                            ),
                          ]),
                        ),
                      ),
                    ])),
                    const SizedBox(height: 18),

                    // ── Recent detections ─────────────────────
                    _Card(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                        const Text('Recent detections', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 17, color: AC.ink)),
                        GestureDetector(
                          onTap: widget.onDetectTap,
                          child: const Text('Open detector', style: TextStyle(color: AC.green, fontSize: 13, fontWeight: FontWeight.w600)),
                        ),
                      ]),
                      const SizedBox(height: 14),
                      if (_history.isEmpty)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 24),
                          child: Center(child: Column(children: [
                            const Icon(Icons.sign_language_outlined, size: 38, color: AC.inkFaint),
                            const SizedBox(height: 10),
                            const Text('No detections yet',
                                style: TextStyle(color: AC.inkFaint, fontSize: 14)),
                            const SizedBox(height: 4),
                            const Text('Use Sign Detection to build your history',
                                style: TextStyle(color: AC.inkFaint, fontSize: 12)),
                            const SizedBox(height: 14),
                            GestureDetector(
                              onTap: widget.onDetectTap,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 9),
                                decoration: BoxDecoration(color: AC.green, borderRadius: BorderRadius.circular(999)),
                                child: const Row(mainAxisSize: MainAxisSize.min, children: [
                                  Icon(Icons.camera_alt_rounded, color: Colors.white, size: 15),
                                  SizedBox(width: 6),
                                  Text('Start detecting', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 13)),
                                ]),
                              ),
                            ),
                          ])),
                        )
                      else
                        Column(children: _history.map((h) => Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          decoration: BoxDecoration(color: AC.surface2, borderRadius: BorderRadius.circular(12)),
                          child: Row(children: [
                            Expanded(child: Text(h.text,
                                style: const TextStyle(fontSize: 20, color: AC.ink, fontWeight: FontWeight.w700),
                                textDirection: TextDirection.rtl)),
                            const SizedBox(width: 10),
                            Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                              Text(HistoryService.relTime(h.timestamp),
                                  style: const TextStyle(fontSize: 11, color: AC.inkFaint)),
                              const SizedBox(height: 4),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: h.kind == 'Phrase' ? AC.violetSoft : AC.greenSoft,
                                  borderRadius: BorderRadius.circular(999),
                                ),
                                child: Text(h.kind,
                                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700,
                                        color: h.kind == 'Phrase' ? AC.violet : AC.green)),
                              ),
                            ]),
                          ]),
                        )).toList()),
                    ])),
                  ]),
                ),
              ),
            ),
    );
  }

  Widget _weekChart() {
    final maxCount = _week.map((d) => d.count).fold(0, (a, b) => a > b ? a : b);
    return SizedBox(
      height: 130,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: _week.map((d) {
          final pct = maxCount > 0 ? d.count / maxCount : 0.0;
          return Expanded(child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Column(mainAxisAlignment: MainAxisAlignment.end, children: [
              if (d.isToday && d.count > 0)
                const Icon(Icons.star_rounded, color: AC.amber, size: 14),
              const SizedBox(height: 4),
              Container(
                height: d.count > 0 ? (80 * pct).clamp(6.0, 80.0) : 4,
                decoration: BoxDecoration(
                  color: d.isToday ? AC.green : (d.count > 0 ? AC.greenSoft : AC.surface2),
                  borderRadius: BorderRadius.circular(6),
                ),
              ),
              const SizedBox(height: 8),
              Text(d.day,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: d.isToday ? AC.green : AC.inkFaint,
                  )),
            ]),
          ));
        }).toList(),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final Color color, soft;
  final String value, label;
  const _StatCard({required this.icon, required this.color, required this.soft, required this.value, required this.label});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(color: AC.surface, borderRadius: BorderRadius.circular(18), border: Border.all(color: AC.line)),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Container(width: 42, height: 42, decoration: BoxDecoration(color: soft, borderRadius: BorderRadius.circular(13)),
          child: Icon(icon, size: 22, color: color)),
      const SizedBox(height: 12),
      Text(value, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 30, color: AC.ink, height: 1)),
      const SizedBox(height: 4),
      Text(label, style: const TextStyle(color: AC.inkFaint, fontSize: 13)),
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
      color: AC.surface,
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: AC.line),
    ),
    child: child,
  );
}
