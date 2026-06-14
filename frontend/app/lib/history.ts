export interface HistoryEntry {
  text: string;
  kind: 'Word' | 'Phrase';
  timestamp: number;
}

const HISTORY_KEY  = 'psl_history';
const ACTIVITY_KEY = 'psl_activity';

export function saveDetection(text: string, kind: HistoryEntry['kind']) {
  if (typeof window === 'undefined' || !text.trim()) return;

  // history
  const history: HistoryEntry[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  history.unshift({ text, kind, timestamp: Date.now() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));

  // daily activity
  const today = todayKey();
  const activity: Record<string, number> = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '{}');
  activity[today] = (activity[today] || 0) + 1;
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity));
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
}

export function getActivity(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '{}');
}

export function getStreak(): number {
  const activity = getActivity();
  const d = new Date();
  // If nothing today but yesterday has activity, start from yesterday
  // (user still has today to extend the streak — Duolingo-style grace)
  if (!activity[dateKey(d)]) {
    const yesterday = new Date(d);
    yesterday.setDate(d.getDate() - 1);
    if (!activity[dateKey(yesterday)]) return 0;
    d.setDate(d.getDate() - 1);
  }
  let streak = 0;
  while (activity[dateKey(d)]) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function getWeek(): { day: string; count: number; isToday: boolean }[] {
  const activity = getActivity();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today = new Date();
  // Build Mon–Sun of the current ISO week
  const dow = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      day: days[d.getDay()],
      count: activity[dateKey(d)] || 0,
      isToday: dateKey(d) === dateKey(today),
    };
  });
}

export function getTotalSigns(): number {
  const activity = getActivity();
  return Object.values(activity).reduce((s, n) => s + n, 0);
}

function todayKey() { return dateKey(new Date()); }
function dateKey(d: Date) { return d.toISOString().split('T')[0]; }
