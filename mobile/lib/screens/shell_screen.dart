import 'package:flutter/material.dart';
import '../widgets/m_tab_bar.dart';
import '../services/classifier_service.dart';
import '../services/tts_service.dart';
import 'home_screen.dart';
import 'learn_screen.dart';
import 'detect_screen.dart';
import 'dictionary_screen.dart';
import 'profile_screen.dart';

class ShellScreen extends StatefulWidget {
  final ClassifierService? classifier;
  final TtsService? tts;
  const ShellScreen({super.key, this.classifier, this.tts});

  @override
  State<ShellScreen> createState() => _ShellScreenState();
}

class _ShellScreenState extends State<ShellScreen> {
  MTab _tab = MTab.home;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F1117),
      body: IndexedStack(
        index: MTab.values.indexOf(_tab),
        children: [
          HomeScreen(onDetectTap: () => setState(() => _tab = MTab.detect)),
          const LearnScreen(),
          DetectScreen(classifier: widget.classifier, tts: widget.tts),
          const DictionaryScreen(),
          const ProfileScreen(),
        ],
      ),
      bottomNavigationBar: MTabBar(
        active: _tab,
        onTap: (t) => setState(() => _tab = t),
      ),
    );
  }
}
