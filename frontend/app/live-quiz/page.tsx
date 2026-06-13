/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { AppShell, TopBar } from '../components/ls/Components';
import * as I from '../components/ls/Icons';

const API = "http://127.0.0.1:8000/api";

/* mode 0 = alphabet detection, mode 1 = word detection */
const ALL_SIGNS = [
  { target: 'ء', image: '/images/alphabet/1.png',  mode: 0 },
  { target: 'ا', image: '/images/alphabet/2.png',  mode: 0 },
  { target: 'ب', image: '/images/alphabet/3.png',  mode: 0 },
  { target: 'پ', image: '/images/alphabet/28.png', mode: 0 },
  { target: 'ت', image: '/images/alphabet/4.png',  mode: 0 },
  { target: 'ٹ', image: '/images/alphabet/27.png', mode: 0 },
  { target: 'ث', image: '/images/alphabet/5.png',  mode: 0 },
  { target: 'ج', image: '/images/alphabet/6.png',  mode: 0 },
  { target: 'چ', image: '/images/alphabet/29.png', mode: 0 },
  { target: 'ح', image: '/images/alphabet/7.png',  mode: 0 },
  { target: 'خ', image: '/images/alphabet/8.png',  mode: 0 },
  { target: 'د', image: '/images/alphabet/9.png',  mode: 0 },
  { target: 'ڈ', image: '/images/alphabet/30.png', mode: 0 },
  { target: 'ذ', image: '/images/alphabet/10.png', mode: 0 },
  { target: 'ر', image: '/images/alphabet/11.png', mode: 0 },
  { target: 'ز', image: '/images/alphabet/12.png', mode: 0 },
  { target: 'ژ', image: '/images/alphabet/31.png', mode: 0 },
  { target: 'س', image: '/images/alphabet/13.png', mode: 0 },
  { target: 'ش', image: '/images/alphabet/14.png', mode: 0 },
  { target: 'ص', image: '/images/alphabet/15.png', mode: 0 },
  { target: 'ض', image: '/images/alphabet/16.png', mode: 0 },
  { target: 'ط', image: '/images/alphabet/17.png', mode: 0 },
  { target: 'ظ', image: '/images/alphabet/18.png', mode: 0 },
  { target: 'ع', image: '/images/alphabet/19.png', mode: 0 },
  { target: 'غ', image: '/images/alphabet/20.png', mode: 0 },
  { target: 'ف', image: '/images/alphabet/21.png', mode: 0 },
  { target: 'ق', image: '/images/alphabet/22.png', mode: 0 },
  { target: 'ک', image: '/images/alphabet/32.png', mode: 0 },
  { target: 'گ', image: '/images/alphabet/33.png', mode: 0 },
  { target: 'ل', image: '/images/alphabet/23.png', mode: 0 },
  { target: 'م', image: '/images/alphabet/24.png', mode: 0 },
  { target: 'ن', image: '/images/alphabet/25.png', mode: 0 },
  { target: 'ں', image: '/images/alphabet/34.png', mode: 0 },
  { target: 'و', image: '/images/alphabet/26.png', mode: 0 },
  { target: 'ھ', image: '/images/alphabet/35.png', mode: 0 },
  { target: 'ی', image: '/images/alphabet/36.png', mode: 0 },
  { target: 'ے', image: '/images/alphabet/37.png', mode: 0 },
  { target: 'السلام علیکم', image: '/images/words/1.png', mode: 1 },
  { target: 'اللہ حافظ',    image: '/images/words/2.png', mode: 1 },
  { target: 'باپ',           image: '/images/words/3.png', mode: 1 },
  { target: 'ماں',           image: '/images/words/4.png', mode: 1 },
  { target: 'میں',           image: '/images/words/5.png', mode: 1 },
];

const QUIZ_LENGTH = 10;

function pickQuestions() {
  const shuffled = [...ALL_SIGNS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, QUIZ_LENGTH);
}

type Sign = typeof ALL_SIGNS[number];
type SessionPhase = 'idle' | 'detecting' | 'correct' | 'wrong';

export default function LiveQuizPage() {
  const [questions, setQuestions] = useState<Sign[]>([]);

  useEffect(() => {
    setQuestions(pickQuestions());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [q, setQ]           = useState(0);
  const [session, setSession] = useState<SessionPhase>('idle');
  const [score, setScore]   = useState(0);
  const [detected, setDetected] = useState('');
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showHint, setShowHint] = useState(false);

  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef<SessionPhase>('idle');
  sessionRef.current = session;
  const qRef       = useRef(0);
  qRef.current     = q;
  const questionsRef = useRef(questions);
  questionsRef.current = questions;

  useEffect(() => () => {
    if (pollRef.current)  clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    fetch(`${API}/stop-capture`, { method: 'POST' }).catch(() => {});
  }, []);

  const stopAll = useCallback(async () => {
    if (pollRef.current)  { clearInterval(pollRef.current);  pollRef.current  = null; }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    await fetch(`${API}/stop-capture`, { method: 'POST' }).catch(() => {});
    setSession('idle');
    setDetected('');
    setTimeLeft(10);
  }, []);

  function startTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!); timerRef.current = null;
          if (sessionRef.current === 'detecting') setSession('wrong');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  async function startSession() {
    setSession('detecting');
    setDetected('');
    setTimeLeft(10);
    await fetch(`${API}/start-capture`, { method: 'POST' }).catch(() => {});

    startTimer();

    pollRef.current = setInterval(async () => {
      if (sessionRef.current !== 'detecting') return;
      const currentQ = questionsRef.current[qRef.current];
      try {
        const res = await fetch(`${API}/match`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: currentQ.mode, speech: 0, voice_mode: 'edge' }),
        });
        const data = await res.json();
        const label: string = data.label ?? '';
        if (!label || label === 'no match' || label === 'no confidence') return;
        setDetected(label);
        if (label === currentQ.target) {
          if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
          setScore(s => s + 1);
          setSession('correct');
        }
      } catch { /* keep polling */ }
    }, 900);
  }

  function next() {
    if (q + 1 >= questions.length) {
      if (pollRef.current)  { clearInterval(pollRef.current);  pollRef.current  = null; }
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      fetch(`${API}/stop-capture`, { method: 'POST' }).catch(() => {});
      setFinished(true);
      return;
    }
    setQ(i => i + 1);
    setDetected('');
    setTimeLeft(10);
    setShowHint(false);
    setSession('detecting');
    startTimer();
  }

  async function restart() {
    await stopAll();
    setQuestions(pickQuestions());
    setQ(0); setScore(0); setDetected(''); setFinished(false); setTimeLeft(10); setShowHint(false);
  }

  if (questions.length === 0) return (
    <AppShell>
      <TopBar title="Live Quiz" sub="Show the correct sign on camera within 10 seconds" />
      <div style={{ display: 'grid', placeItems: 'center', minHeight: 300, color: 'var(--ink-faint)', fontSize: 14 }}>
        Loading quiz…
      </div>
    </AppShell>
  );

  const question = questions[q];
  const ringPct  = (timeLeft / 10) * 100;
  const ringColor = session === 'correct' ? 'var(--green)' : session === 'wrong' ? 'var(--coral)' : 'var(--primary)';

  if (finished) return (
    <AppShell>
      <TopBar title="Live Quiz" sub="Camera-based sign recognition quiz" />
      <div style={{ padding: 'clamp(16px,3vw,32px)', display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 480, width: '100%' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>
            {score >= questions.length * 0.8 ? '🏆' : score >= questions.length * 0.5 ? '⭐' : '💪'}
          </div>
          <h2 style={{ fontSize: 28, marginBottom: 8 }}>Quiz complete!</h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 28 }}>You scored {score} out of {questions.length}</p>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, color: 'var(--primary)' }}>{score}/{questions.length}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-faint)' }}>Score</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, color: 'var(--green)' }}>{Math.round((score / questions.length) * 100)}%</div>
              <div style={{ fontSize: 13, color: 'var(--ink-faint)' }}>Accuracy</div>
            </div>
          </div>
          <button onClick={restart} className="btn btn-primary" style={{ width: '100%' }}>Try again</button>
        </div>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <TopBar title="Live Quiz" sub="Show the correct sign on camera within 10 seconds" />
      <div style={{ padding: 'clamp(16px,3vw,32px)', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 960, margin: '0 auto', minHeight: 'calc(100vh - 65px)', boxSizing: 'border-box' }}>

        {/* Step dots + score */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {questions.map((_, i) => (
              <div key={i} style={{ width: 22, height: 7, borderRadius: 999, background: i < q ? 'var(--green)' : i === q ? 'var(--primary)' : 'var(--line)', transition: 'background 0.3s' }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
            <I.Star size={16} /> {score} pts
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20, flex: 1, minHeight: 0 }}>

          {/* Question + timer + controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 8 }}>
                Question {q + 1} of {questions.length}
              </div>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', margin: '0 0 14px' }}>Show the sign for:</p>

              {/* Urdu text */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontFamily: 'var(--font-urdu)', fontSize: question.mode === 1 ? 28 : 64, lineHeight: 1.3, direction: 'rtl' }}>
                  {question.target}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  {/* Badge */}
                  <span style={{
                    display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                    padding: '3px 10px', borderRadius: 999,
                    background: question.mode === 0 ? 'rgba(26,107,65,0.12)' : 'rgba(120,80,200,0.12)',
                    color: question.mode === 0 ? 'var(--primary)' : '#7850c8',
                  }}>
                    {question.mode === 0 ? 'ALPHABET' : 'WORD'}
                  </span>
                  {/* Hint button */}
                  {!showHint && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="btn"
                      style={{ fontSize: 12, padding: '5px 14px', height: 'auto', background: 'var(--surface-2)', fontWeight: 700 }}
                    >
                      Hint
                    </button>
                  )}
                </div>
              </div>

              {/* Sign image — shown only after Hint is pressed */}
              {showHint && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 110, height: 110, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
                    border: `3px solid ${session === 'correct' ? 'var(--green)' : session === 'wrong' ? 'var(--coral)' : 'var(--line)'}`,
                    transition: 'border-color 0.3s',
                  }}>
                    <img
                    src={question.image}
                    alt="Sign hint"
                    onClick={() => setShowHint(false)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                  />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>Make this hand sign</span>
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
                <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="26" cy="26" r="22" fill="none" stroke="var(--line)" strokeWidth="4" />
                  <circle cx="26" cy="26" r="22" fill="none" stroke={ringColor} strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - ringPct / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>
                  {session === 'detecting' ? timeLeft : '—'}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {session === 'idle'      ? 'Press Start to begin' :
                   session === 'detecting' ? `${timeLeft}s remaining` :
                   session === 'correct'   ? '✓ Correct!' : '✗ Time up'}
                </div>
                {detected && session === 'detecting' && (
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 3 }}>
                    Seeing: <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 18 }}>{detected}</span>
                  </div>
                )}
              </div>
            </div>

            {session === 'idle' && (
              <button onClick={startSession} className="btn btn-primary" style={{ height: 48, fontSize: 15 }}>
                <I.Camera size={18} /> Start Quiz
              </button>
            )}
            {(session === 'correct' || session === 'wrong') && (
              <button onClick={next} className="btn btn-primary" style={{ height: 48, fontSize: 15 }}>
                {q + 1 >= questions.length ? 'See results →' : 'Next question →'}
              </button>
            )}
            {session !== 'idle' && (
              <button onClick={stopAll} className="btn" style={{ height: 40, background: 'var(--surface-2)', fontSize: 14, fontWeight: 700 }}>
                Stop camera
              </button>
            )}
          </div>

          {/* Camera feed */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, background: '#0c111a', position: 'relative', minHeight: 0 }}>
              {session !== 'idle' ? (
                <img
                  src={`${API}/stream`}
                  alt="Live feed"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'rgba(255,255,255,0.35)' }}>
                  <I.Camera size={48} sw={1.2} />
                  <span style={{ fontSize: 14 }}>Camera inactive</span>
                </div>
              )}

              {session !== 'idle' && (
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.55)', borderRadius: 999, padding: '4px 12px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: 'nodePulse 1.2s ease-in-out infinite' }} />
                  <span style={{ fontSize: 12, color: 'white', fontWeight: 700 }}>LIVE</span>
                </div>
              )}
              {session === 'correct' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,200,100,0.18)', display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
                  <div style={{ fontSize: 80, color: 'white', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>&#10003;</div>
                </div>
              )}
              {session === 'wrong' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(220,60,60,0.2)', display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: 52 }}>&#10007;</div>
                    <div style={{ fontSize: 13, marginTop: 8, fontWeight: 600 }}>
                      Correct: <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 22 }}>{question.target}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--line)', fontSize: 13, color: 'var(--ink-faint)', textAlign: 'center' }}>
              Hold your hand sign steady in front of the camera
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
