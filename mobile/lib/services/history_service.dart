import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class HistoryEntry {
  final String text;
  final String kind; // 'Word' or 'Phrase'
  final int timestamp;

  const HistoryEntry({
    required this.text,
    required this.kind,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() =>
      {'text': text, 'kind': kind, 'timestamp': timestamp};

  factory HistoryEntry.fromJson(Map<String, dynamic> j) => HistoryEntry(
        text: j['text'] as String,
        kind: j['kind'] as String,
        timestamp: j['timestamp'] as int,
      );
}

class HistoryService {
  static const _histKey = 'psl_history';
  static const _actKey  = 'psl_activity';

  static Future<void> saveDetection(String text, String kind) async {
    if (text.trim().isEmpty) return;
    final prefs = await SharedPreferences.getInstance();

    // History (newest-first, max 50)
    final raw = prefs.getString(_histKey) ?? '[]';
    final list = (jsonDecode(raw) as List)
        .map((e) => HistoryEntry.fromJson(e as Map<String, dynamic>))
        .toList();
    list.insert(0, HistoryEntry(
      text: text, kind: kind,
      timestamp: DateTime.now().millisecondsSinceEpoch,
    ));
    await prefs.setString(
        _histKey,
        jsonEncode(list.take(50).map((e) => e.toJson()).toList()));

    // Daily activity counter
    final today = _dateKey(DateTime.now());
    final actRaw = prefs.getString(_actKey) ?? '{}';
    final activity = Map<String, int>.from(jsonDecode(actRaw) as Map);
    activity[today] = (activity[today] ?? 0) + 1;
    await prefs.setString(_actKey, jsonEncode(activity));
  }

  static Future<List<HistoryEntry>> getHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_histKey) ?? '[]';
    return (jsonDecode(raw) as List)
        .map((e) => HistoryEntry.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  static Future<Map<String, int>> getActivity() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_actKey) ?? '{}';
    return Map<String, int>.from(jsonDecode(raw) as Map);
  }

  static Future<int> getStreak() async {
    final activity = await getActivity();
    var d = DateTime.now();
    if ((activity[_dateKey(d)] ?? 0) == 0) {
      final yesterday = d.subtract(const Duration(days: 1));
      if ((activity[_dateKey(yesterday)] ?? 0) == 0) return 0;
      d = yesterday;
    }
    int streak = 0;
    while ((activity[_dateKey(d)] ?? 0) > 0) {
      streak++;
      d = d.subtract(const Duration(days: 1));
    }
    return streak;
  }

  static Future<List<({String day, int count, bool isToday})>> getWeek() async {
    final activity = await getActivity();
    final today = DateTime.now();
    // Find Monday of current week
    final monday = today.subtract(Duration(days: today.weekday - 1));
    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return List.generate(7, (i) {
      final d = monday.add(Duration(days: i));
      return (
        day: names[i],
        count: activity[_dateKey(d)] ?? 0,
        isToday: _dateKey(d) == _dateKey(today),
      );
    });
  }

  static Future<int> getTotalSigns() async {
    final activity = await getActivity();
    return activity.values.fold<int>(0, (s, v) => s + v);
  }

  static Future<void> clearHistory() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_histKey);
    await prefs.remove(_actKey);
  }

  static String _dateKey(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  static String relTime(int ts) {
    final diff = DateTime.now().millisecondsSinceEpoch - ts;
    final m = diff ~/ 60000;
    if (m < 1) return 'just now';
    if (m < 60) return '${m}m ago';
    final h = m ~/ 60;
    if (h < 24) return '${h}h ago';
    final days = h ~/ 24;
    return days == 1 ? 'Yesterday' : '${days}d ago';
  }
}
