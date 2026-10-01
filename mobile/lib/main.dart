import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';
import 'services/classifier_service.dart';
import 'services/tts_service.dart';
import 'screens/onboarding_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
  ));

  final classifier = ClassifierService();
  final tts = TtsService();
  try {
    await Future.wait([classifier.init(), tts.init()]);
  } catch (e) {
    debugPrint('LinguaSign: service init error: $e');
  }

  runApp(LinguaSignApp(classifier: classifier, tts: tts));
}

class LinguaSignApp extends StatelessWidget {
  final ClassifierService classifier;
  final TtsService tts;
  const LinguaSignApp({super.key, required this.classifier, required this.tts});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LinguaSign',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: AC.bg,
        colorScheme: const ColorScheme.dark(
          primary: AC.green,
          secondary: AC.violet,
          surface: AC.surface,
        ),
        textTheme: GoogleFonts.poppinsTextTheme(ThemeData.dark().textTheme),
        appBarTheme: const AppBarTheme(
          backgroundColor: AC.bg,
          elevation: 0,
          foregroundColor: AC.ink,
        ),
      ),
      home: OnboardingScreen(classifier: classifier, tts: tts),
    );
  }
}
