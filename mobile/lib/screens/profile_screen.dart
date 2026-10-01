import 'package:flutter/material.dart';
import '../app_colors.dart';
import '../services/history_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _voice = false, _wordMode = false;
  bool _clearing = false;

  Future<void> _clearHistory() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: AC.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: const Text('Clear history?', style: TextStyle(color: AC.ink, fontWeight: FontWeight.w700)),
        content: const Text('This will delete all detections and reset your streak.',
            style: TextStyle(color: AC.inkSoft, fontSize: 14.5)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel', style: TextStyle(color: AC.inkSoft)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Clear', style: TextStyle(color: AC.coral, fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
    if (ok != true) return;
    setState(() => _clearing = true);
    await HistoryService.clearHistory();
    if (mounted) setState(() => _clearing = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('History cleared'),
          backgroundColor: AC.surface2,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AC.bg,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(18, 14, 18, 32),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

            // ── Header ────────────────────────────────────
            const Text('Settings', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AC.ink)),
            const SizedBox(height: 6),
            const Text('Preferences and app information',
                style: TextStyle(fontSize: 13.5, color: AC.inkFaint)),
            const SizedBox(height: 24),

            // ── App identity card ─────────────────────────
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AC.surface, borderRadius: BorderRadius.circular(18), border: Border.all(color: AC.line),
              ),
              child: Row(children: [
                Container(
                  width: 58, height: 58,
                  decoration: BoxDecoration(gradient: AC.gradGreen, borderRadius: BorderRadius.circular(18)),
                  child: const Icon(Icons.sign_language_rounded, color: Colors.white, size: 30),
                ),
                const SizedBox(width: 16),
                const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('LinguaSign', style: TextStyle(fontSize: 19, fontWeight: FontWeight.w800, color: AC.ink)),
                  SizedBox(height: 3),
                  Text('Pakistan Sign Language · Offline · v1.0.0',
                      style: TextStyle(fontSize: 12.5, color: AC.inkFaint)),
                ])),
              ]),
            ),
            const SizedBox(height: 20),

            // ── Detection settings ────────────────────────
            _sectionLabel('DETECTION'),
            _settingsCard([
              _ToggleRow(
                icon: Icons.volume_up_rounded, color: 'green',
                title: 'Voice output',
                sub: 'Speak detected signs aloud',
                value: _voice,
                onChanged: (v) => setState(() => _voice = v),
              ),
              _ToggleRow(
                icon: Icons.text_fields_rounded, color: 'sky',
                title: 'Word mode default',
                sub: 'Start detector in word mode',
                value: _wordMode,
                onChanged: (v) => setState(() => _wordMode = v),
                last: true,
              ),
            ]),
            const SizedBox(height: 20),

            // ── Data ──────────────────────────────────────
            _sectionLabel('DATA'),
            _settingsCard([
              _ActionRow(
                icon: Icons.delete_outline_rounded, color: 'coral',
                title: 'Clear history',
                sub: 'Delete all detections and streak',
                onTap: _clearing ? null : _clearHistory,
                trailing: _clearing
                    ? const SizedBox(width: 18, height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2, color: AC.coral))
                    : const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AC.inkFaint),
                last: true,
              ),
            ]),
            const SizedBox(height: 20),

            // ── About ─────────────────────────────────────
            _sectionLabel('ABOUT'),
            _settingsCard([
              _InfoRow(icon: Icons.offline_bolt_rounded, color: 'violet',
                  title: 'Fully offline', sub: 'All AI runs on-device'),
              _InfoRow(icon: Icons.language_rounded, color: 'sky',
                  title: 'Language', sub: 'Urdu / Pakistan Sign Language'),
              _InfoRow(icon: Icons.phone_android_rounded, color: 'amber',
                  title: 'Platform', sub: 'Android', last: true),
            ]),
          ]),
        ),
      ),
    );
  }

  Widget _sectionLabel(String text) => Padding(
    padding: const EdgeInsets.only(left: 4, bottom: 8),
    child: Text(text,
        style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700,
            color: AC.inkFaint, letterSpacing: 0.08)),
  );

  Widget _settingsCard(List<Widget> rows) => Container(
    decoration: BoxDecoration(
      color: AC.surface, borderRadius: BorderRadius.circular(18), border: Border.all(color: AC.line),
    ),
    child: Column(children: rows),
  );
}

class _ToggleRow extends StatelessWidget {
  final IconData icon;
  final String color, title, sub;
  final bool value, last;
  final ValueChanged<bool> onChanged;
  const _ToggleRow({required this.icon, required this.color, required this.title,
      required this.sub, required this.value, required this.onChanged, this.last = false});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.fromLTRB(16, 13, 16, 13),
    decoration: BoxDecoration(
      border: last ? null : const Border(bottom: BorderSide(color: AC.line)),
    ),
    child: Row(children: [
      Container(width: 38, height: 38,
          decoration: BoxDecoration(color: AC.soft(color), borderRadius: BorderRadius.circular(11)),
          child: Icon(icon, size: 19, color: AC.accent(color))),
      const SizedBox(width: 14),
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15, color: AC.ink)),
        Text(sub, style: const TextStyle(fontSize: 12, color: AC.inkFaint)),
      ])),
      GestureDetector(
        onTap: () => onChanged(!value),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: 46, height: 27,
          decoration: BoxDecoration(
            color: value ? AC.green : AC.surface2,
            borderRadius: BorderRadius.circular(999),
          ),
          child: AnimatedAlign(
            duration: const Duration(milliseconds: 200),
            alignment: value ? Alignment.centerRight : Alignment.centerLeft,
            child: Padding(padding: const EdgeInsets.all(3),
              child: Container(width: 21, height: 21,
                  decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle))),
          ),
        ),
      ),
    ]),
  );
}

class _ActionRow extends StatelessWidget {
  final IconData icon;
  final String color, title, sub;
  final VoidCallback? onTap;
  final Widget? trailing;
  final bool last;
  const _ActionRow({required this.icon, required this.color, required this.title,
      required this.sub, this.onTap, this.trailing, this.last = false});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.fromLTRB(16, 13, 16, 13),
      decoration: BoxDecoration(
        border: last ? null : const Border(bottom: BorderSide(color: AC.line)),
      ),
      child: Row(children: [
        Container(width: 38, height: 38,
            decoration: BoxDecoration(color: AC.soft(color), borderRadius: BorderRadius.circular(11)),
            child: Icon(icon, size: 19, color: AC.accent(color))),
        const SizedBox(width: 14),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15, color: AC.ink)),
          Text(sub, style: const TextStyle(fontSize: 12, color: AC.inkFaint)),
        ])),
        trailing ?? const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AC.inkFaint),
      ]),
    ),
  );
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String color, title, sub;
  final bool last;
  const _InfoRow({required this.icon, required this.color, required this.title,
      required this.sub, this.last = false});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.fromLTRB(16, 13, 16, 13),
    decoration: BoxDecoration(
      border: last ? null : const Border(bottom: BorderSide(color: AC.line)),
    ),
    child: Row(children: [
      Container(width: 38, height: 38,
          decoration: BoxDecoration(color: AC.soft(color), borderRadius: BorderRadius.circular(11)),
          child: Icon(icon, size: 19, color: AC.accent(color))),
      const SizedBox(width: 14),
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15, color: AC.ink)),
        Text(sub, style: const TextStyle(fontSize: 12, color: AC.inkFaint)),
      ])),
    ]),
  );
}
