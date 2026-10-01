import 'package:flutter/material.dart';
import '../app_colors.dart';
import '../services/classifier_service.dart';
import '../services/tts_service.dart';
import 'shell_screen.dart';

class AuthScreen extends StatefulWidget {
  final ClassifierService classifier;
  final TtsService tts;
  const AuthScreen({super.key, required this.classifier, required this.tts});
  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _isLogin = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AC.bg,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(26, 8, 26, 24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const SizedBox(height: 12),
            // logo icon
            Container(
              width: 56, height: 56,
              decoration: BoxDecoration(
                gradient: AC.gradGreen,
                borderRadius: BorderRadius.circular(18),
                boxShadow: [BoxShadow(color: AC.green.withOpacity(0.4), blurRadius: 18, offset: const Offset(0, 8))],
              ),
              child: const Icon(Icons.sign_language, color: Colors.white, size: 30),
            ),
            const SizedBox(height: 22),
            const Text('Create account',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AC.ink)),
            const SizedBox(height: 6),
            const Text('Start translating and learning PSL for free.',
                style: TextStyle(color: AC.inkSoft, fontSize: 15)),
            const SizedBox(height: 24),

            // segmented control
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(color: AC.surface2, borderRadius: BorderRadius.circular(999)),
              child: Row(children: [
                _seg('Sign up', !_isLogin, () => setState(() => _isLogin = false)),
                _seg('Log in',  _isLogin,  () => setState(() => _isLogin = true)),
              ]),
            ),
            const SizedBox(height: 22),

            // fields
            if (!_isLogin) ...[
              _field('Full name', 'Ayesha Khan', Icons.person_outline_rounded),
              const SizedBox(height: 15),
            ],
            _field('Email', 'you@email.com', Icons.language_rounded),
            const SizedBox(height: 15),
            _field('Password', '••••••••', Icons.flash_on_rounded, obscure: true),
            const SizedBox(height: 24),

            // primary button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AC.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: _submit,
                child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Text(_isLogin ? 'Log in' : 'Create account',
                      style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
                  const SizedBox(width: 8),
                  const Icon(Icons.arrow_forward_rounded, size: 19),
                ]),
              ),
            ),

            // divider
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 20),
              child: Row(children: [
                const Expanded(child: Divider(color: AC.line)),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Text('or', style: TextStyle(color: AC.inkFaint, fontSize: 12.5)),
                ),
                const Expanded(child: Divider(color: AC.line)),
              ]),
            ),

            // social buttons
            Row(children: [
              Expanded(child: _socialBtn('Google', Icons.g_mobiledata_rounded)),
              const SizedBox(width: 12),
              Expanded(child: _socialBtn('Apple', Icons.apple_rounded)),
            ]),
          ]),
        ),
      ),
    );
  }

  Widget _seg(String label, bool on, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 9),
          decoration: BoxDecoration(
            color: on ? AC.surface : Colors.transparent,
            borderRadius: BorderRadius.circular(999),
            boxShadow: on ? [BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 4)] : [],
          ),
          alignment: Alignment.center,
          child: Text(label,
              style: TextStyle(
                fontSize: 13, fontWeight: FontWeight.w600,
                color: on ? AC.ink : AC.inkFaint,
                fontFamily: 'Poppins',
              )),
        ),
      ),
    );
  }

  Widget _field(String label, String placeholder, IconData icon, {bool obscure = false}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AC.inkSoft)),
      const SizedBox(height: 7),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: AC.surface2,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AC.line, width: 1.5),
        ),
        child: Row(children: [
          Icon(icon, size: 19, color: AC.inkFaint),
          const SizedBox(width: 11),
          Text(placeholder,
              style: TextStyle(fontSize: 15, color: obscure ? AC.ink : AC.inkFaint)),
        ]),
      ),
    ]);
  }

  Widget _socialBtn(String label, IconData icon) {
    return OutlinedButton.icon(
      style: OutlinedButton.styleFrom(
        foregroundColor: AC.ink,
        side: const BorderSide(color: AC.line, width: 1.5),
        padding: const EdgeInsets.symmetric(vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
      icon: Icon(icon, size: 22),
      label: Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
      onPressed: _submit,
    );
  }

  void _submit() => Navigator.pushReplacement(
      context, MaterialPageRoute(builder: (_) => ShellScreen(classifier: widget.classifier, tts: widget.tts)));
}
