/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { AppShell, TopBar } from '../components/ls/Components';
import * as I from '../components/ls/Icons';

const API = "http://127.0.0.1:8000/api";

// image index matches /public/images/alphabet/N.png (same order as dictionary LABELS)
const ALPHABETS = [
  { label: 'ء', roman: 'Hamza',       image: '/images/alphabet/1.png'  },
  { label: 'ا', roman: 'Alif',        image: '/images/alphabet/2.png'  },
  { label: 'ب', roman: 'Bay',         image: '/images/alphabet/3.png'  },
  { label: 'پ', roman: 'Pay',         image: '/images/alphabet/28.png' },
  { label: 'ت', roman: 'Tay',         image: '/images/alphabet/4.png'  },
  { label: 'ٹ', roman: 'Ttay',        image: '/images/alphabet/27.png' },
  { label: 'ث', roman: 'Thay',        image: '/images/alphabet/5.png'  },
  { label: 'ج', roman: 'Jeem',        image: '/images/alphabet/6.png'  },
  { label: 'چ', roman: 'Chay',        image: '/images/alphabet/29.png' },
  { label: 'ح', roman: 'Hay',         image: '/images/alphabet/7.png'  },
  { label: 'خ', roman: 'Khay',        image: '/images/alphabet/8.png'  },
  { label: 'د', roman: 'Daal',        image: '/images/alphabet/9.png'  },
  { label: 'ڈ', roman: 'Dday',        image: '/images/alphabet/30.png' },
  { label: 'ذ', roman: 'Dhaal',       image: '/images/alphabet/10.png' },
  { label: 'ر', roman: 'Ray',         image: '/images/alphabet/11.png' },
  { label: 'ز', roman: 'Zay',         image: '/images/alphabet/12.png' },
  { label: 'ژ', roman: 'Zhay',        image: '/images/alphabet/31.png' },
  { label: 'س', roman: 'Seen',        image: '/images/alphabet/13.png' },
  { label: 'ش', roman: 'Sheen',       image: '/images/alphabet/14.png' },
  { label: 'ص', roman: 'Suaad',       image: '/images/alphabet/15.png' },
  { label: 'ض', roman: 'Duaad',       image: '/images/alphabet/16.png' },
  { label: 'ط', roman: 'Toy',         image: '/images/alphabet/17.png' },
  { label: 'ظ', roman: 'Zoy',         image: '/images/alphabet/18.png' },
  { label: 'ع', roman: 'Ain',         image: '/images/alphabet/19.png' },
  { label: 'غ', roman: 'Ghain',       image: '/images/alphabet/20.png' },
  { label: 'ف', roman: 'Fay',         image: '/images/alphabet/21.png' },
  { label: 'ق', roman: 'Qaaf',        image: '/images/alphabet/22.png' },
  { label: 'ک', roman: 'Kaaf',        image: '/images/alphabet/32.png' },
  { label: 'گ', roman: 'Gaaf',        image: '/images/alphabet/33.png' },
  { label: 'ل', roman: 'Laam',        image: '/images/alphabet/23.png' },
  { label: 'م', roman: 'Meem',        image: '/images/alphabet/24.png' },
  { label: 'ن', roman: 'Noon',        image: '/images/alphabet/25.png' },
  { label: 'ں', roman: 'Noon Ghunna', image: '/images/alphabet/34.png' },
  { label: 'و', roman: 'Wao',         image: '/images/alphabet/26.png' },
  { label: 'ھ', roman: 'Dho Chashmi', image: '/images/alphabet/35.png' },
  { label: 'ی', roman: 'Yay',         image: '/images/alphabet/36.png' },
  { label: 'ے', roman: 'Barray Yay',  image: '/images/alphabet/37.png' },
];

const WORDS = [
  { label: 'السلام علیکم', roman: 'As-salaam Alaikum', image: '/images/words/1.png' },
  { label: 'اللہ حافظ',    roman: 'Allah Hafiz',        image: '/images/words/2.png' },
  { label: 'باپ',           roman: 'Baap',               image: '/images/words/3.png' },
  { label: 'ماں',           roman: 'Maan',               image: '/images/words/4.png' },
  { label: 'میں',           roman: 'Mein',               image: '/images/words/5.png' },
];

type Mode  = 'alphabets' | 'words';
type Phase = 'idle' | 'detecting' | 'correct';

export default function LiveLearnPage() {
  const [mode, setMode]         = useState<Mode>('alphabets');
  const [idx, setIdx]           = useState(0);
  const [phase, setPhase]       = useState<Phase>('idle');
  const [streak, setStreak]     = useState(0);
  const [done, setDone]         = useState<number[]>([]);
  const [detected, setDetected] = useState('');

  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashRef   = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const idxRef     = useRef(0);   idxRef.current  = idx;
  const modeRef    = useRef<Mode>('alphabets'); modeRef.current = mode;
  const phaseRef   = useRef<Phase>('idle');     phaseRef.current = phase;

  const SIGNS   = mode === 'alphabets' ? ALPHABETS : WORDS;
  const sign    = SIGNS[idx] ?? SIGNS[0];
  const progress = (done.length / SIGNS.length) * 100;

  useEffect(() => () => {
    if (pollRef.current)  clearInterval(pollRef.current);
    if (flashRef.current) clearTimeout(flashRef.current);
    fetch(`${API}/stop-capture`, { method: 'POST' }).catch(() => {});
  }, []);

  const stopAll = useCallback(async () => {
    if (pollRef.current)  { clearInterval(pollRef.current);  pollRef.current  = null; }
    if (flashRef.current) { clearTimeout(flashRef.current);  flashRef.current = null; }
    await fetch(`${API}/stop-capture`, { method: 'POST' }).catch(() => {});
    setPhase('idle');
    setDetected('');
  }, []);

  async function switchMode(m: Mode) {
    await stopAll();
    setMode(m); setIdx(0); setDone([]); setStreak(0);
  }

  function advanceSign() {
    if (flashRef.current) { clearTimeout(flashRef.current); flashRef.current = null; }
    const signs = modeRef.current === 'alphabets' ? ALPHABETS : WORDS;
    setIdx(i => (i + 1) % signs.length);
    setDetected('');
    setPhase('detecting');
  }

  async function startSession() {
    setPhase('detecting');
    setDetected('');
    await fetch(`${API}/start-capture`, { method: 'POST' }).catch(() => {});

    pollRef.current = setInterval(async () => {
      if (phaseRef.current !== 'detecting') return;
      try {
        const apiMode = modeRef.current === 'words' ? 1 : 0;
        const res = await fetch(`${API}/match`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: apiMode, speech: 0, voice_mode: 'edge' }),
        });
        const data = await res.json();
        const label: string = data.label ?? '';
        if (!label || label === 'no match' || label === 'no confidence') return;
        setDetected(label);
        const signs = modeRef.current === 'alphabets' ? ALPHABETS : WORDS;
        if (label === signs[idxRef.current].label) {
          setPhase('correct');
          setStreak(s => s + 1);
          setDone(d => d.includes(idxRef.current) ? d : [...d, idxRef.current]);
          flashRef.current = setTimeout(advanceSign, 1300);
        }
      } catch { /* keep polling */ }
    }, 900);
  }

  function skip() {
    if (phaseRef.current === 'idle') return;
    if (flashRef.current) { clearTimeout(flashRef.current); flashRef.current = null; }
    setStreak(0);
    const signs = modeRef.current === 'alphabets' ? ALPHABETS : WORDS;
    setIdx(i => (i + 1) % signs.length);
    setDetected('');
    setPhase('detecting');
  }

  const borderColor =
    phase === 'correct'   ? 'var(--green)'   :
    phase === 'detecting' ? 'var(--primary)'  : 'var(--line)';

  return (
    <AppShell>
      <TopBar title="Live Learn" sub="Show the sign on camera — get real-time feedback" />
      <div style={{ padding: 'clamp(16px,3vw,32px)', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 960, margin: '0 auto' }}>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['alphabets', 'words'] as Mode[]).map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{
              padding: '8px 22px', borderRadius: 999, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
              border: '2px solid', cursor: 'pointer', transition: 'all 0.2s',
              borderColor: mode === m ? 'var(--primary)' : 'var(--line)',
              background:  mode === m ? 'var(--green-soft)' : 'var(--surface-2)',
              color:       mode === m ? 'var(--primary)' : 'var(--ink-soft)',
            }}>
              {m === 'alphabets' ? 'Alphabets' : 'Words'}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1, height: 8, borderRadius: 999, background: 'var(--surface-2)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', borderRadius: 999, transition: 'width 0.5s var(--ease)' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
            {done.length}/{SIGNS.length}
          </span>
          {streak > 1 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: 'var(--amber)', padding: '3px 10px', background: 'oklch(0.97 0.04 80)', borderRadius: 999 }}>
              <I.Flame size={14} /> {streak} streak
            </span>
          )}
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}>

          {/* Sign panel */}
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.09em', textTransform: 'uppercase' }}>
              {mode === 'alphabets' ? 'Sign this letter' : 'Sign this word'}
            </div>

            {/* Sign image */}
            <div style={{
              width: '100%', borderRadius: 14,
              border: `3px solid ${borderColor}`,
              overflow: 'hidden', position: 'relative',
              aspectRatio: '1',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              boxShadow: phase === 'correct'   ? `0 0 0 6px oklch(0.74 0.16 158 / 0.22)` :
                         phase === 'detecting' ? `0 0 0 6px oklch(0.74 0.16 158 / 0.10)` : 'none',
            }}>
              <img
                src={sign.image}
                alt={sign.roman}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {phase === 'correct' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,200,100,0.35)', display: 'grid', placeItems: 'center' }}>
                  <span style={{ fontSize: 72, color: 'white', textShadow: '0 4px 16px rgba(0,0,0,0.5)' }}>✓</span>
                </div>
              )}
            </div>

            {/* Urdu label only */}
            <div style={{ fontFamily: 'var(--font-urdu)', fontSize: 40, lineHeight: 1.3, color: 'var(--ink)', direction: 'rtl', textAlign: 'center' }}>
              {sign.label}
            </div>

            {/* Live detected label */}
            {detected && phase === 'detecting' && (
              <div style={{ padding: '4px 14px', borderRadius: 999, background: 'var(--surface-2)', fontSize: 13, color: 'var(--ink-soft)' }}>
                Seeing: <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 18, direction: 'rtl' }}>{detected}</span>
              </div>
            )}
          </div>

          {/* Camera panel */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, background: '#0c111a', position: 'relative', minHeight: 300 }}>
              {phase !== 'idle' ? (
                <img src={`${API}/stream`} alt="Live feed" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'rgba(255,255,255,0.35)' }}>
                  <I.Camera size={48} sw={1.2} />
                  <span style={{ fontSize: 14 }}>Press Start to open camera</span>
                </div>
              )}
              {phase !== 'idle' && (
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.55)', borderRadius: 999, padding: '4px 12px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: 'nodePulse 1.2s ease-in-out infinite' }} />
                  <span style={{ fontSize: 12, color: 'white', fontWeight: 700 }}>LIVE</span>
                </div>
              )}
              {phase === 'correct' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,200,100,0.2)', display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
                  <div style={{ fontSize: 80, color: 'white', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>✓</div>
                </div>
              )}
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', display: 'flex', gap: 8 }}>
              {phase === 'idle' ? (
                <button onClick={startSession} className="btn btn-primary" style={{ flex: 1 }}>
                  <I.Camera size={17} /> Start
                </button>
              ) : (
                <>
                  <button onClick={stopAll} className="btn" style={{ flex: 1, background: 'var(--surface-2)', fontWeight: 700 }}>Stop</button>
                  <button onClick={skip} disabled={phase === 'correct'} className="btn" style={{ background: 'var(--surface-2)' }}>Skip</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sign grid — RTL so Urdu reads right-to-left */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-faint)', marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {mode === 'alphabets' ? 'All 37 letters' : 'All words'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, direction: 'rtl' }}>
            {SIGNS.map((s, i) => (
              <button key={s.label} onClick={() => {
                if (phase === 'idle') return;
                if (flashRef.current) { clearTimeout(flashRef.current); flashRef.current = null; }
                setIdx(i); setDetected(''); setPhase('detecting');
              }} style={{
                minWidth: mode === 'words' ? 'auto' : 44,
                height: 44,
                padding: mode === 'words' ? '0 14px' : '0',
                width:   mode === 'words' ? 'auto' : 44,
                borderRadius: 10, border: '1.5px solid',
                borderColor: i === idx && phase !== 'idle' ? 'var(--primary)' : done.includes(i) ? 'var(--green)' : 'var(--line)',
                background:  i === idx && phase !== 'idle' ? 'var(--green-soft)' : done.includes(i) ? 'oklch(0.97 0.04 158)' : 'var(--surface-2)',
                fontFamily: 'var(--font-urdu)', fontWeight: 700, fontSize: mode === 'words' ? 15 : 20,
                color: i === idx && phase !== 'idle' ? 'var(--primary)' : done.includes(i) ? 'var(--green-deep)' : 'var(--ink)',
                cursor: phase === 'idle' ? 'default' : 'pointer',
                transition: 'all 0.2s', opacity: phase === 'idle' ? 0.5 : 1,
                direction: 'rtl',
              }}>{s.label}</button>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
