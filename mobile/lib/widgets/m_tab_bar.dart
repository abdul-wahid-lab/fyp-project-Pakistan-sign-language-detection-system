import 'package:flutter/material.dart';
import '../app_colors.dart';

enum MTab { home, learn, detect, dictionary, profile }

class MTabBar extends StatelessWidget {
  final MTab active;
  final ValueChanged<MTab> onTap;

  const MTabBar({super.key, required this.active, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 84,
      decoration: BoxDecoration(
        color: AC.surface,
        border: const Border(top: BorderSide(color: AC.line)),
      ),
      child: Row(
        children: [
          _tab(MTab.home,       Icons.home_rounded,          'Home'),
          _tab(MTab.learn,      Icons.menu_book_rounded,     'Learn'),
          _center(),
          _tab(MTab.dictionary, Icons.auto_stories_rounded,  'Dictionary'),
          _tab(MTab.profile,    Icons.person_rounded,        'Profile'),
        ],
      ),
    );
  }

  Widget _tab(MTab tab, IconData icon, String label) {
    final on = active == tab;
    return Expanded(
      child: GestureDetector(
        onTap: () => onTap(tab),
        behavior: HitTestBehavior.opaque,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            const SizedBox(height: 12),
            Icon(icon,
                size: 24,
                color: on ? AC.green : AC.inkFaint),
            const SizedBox(height: 5),
            Text(label,
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w600,
                  color: on ? AC.green : AC.inkFaint,
                )),
          ],
        ),
      ),
    );
  }

  Widget _center() {
    return Expanded(
      child: Transform.translate(
        offset: const Offset(0, -22),
        child: GestureDetector(
          onTap: () => onTap(MTab.detect),
          child: Column(children: [
            Container(
              width: 60, height: 60,
              decoration: BoxDecoration(
                gradient: AC.gradGreen,
                borderRadius: BorderRadius.circular(22),
                boxShadow: [
                  BoxShadow(
                    color: AC.green.withOpacity(0.45),
                    blurRadius: 24,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 28),
            ),
            const SizedBox(height: 5),
            Text('Detect',
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w600,
                  color: active == MTab.detect ? AC.green : AC.inkFaint,
                )),
          ]),
        ),
      ),
    );
  }
}
