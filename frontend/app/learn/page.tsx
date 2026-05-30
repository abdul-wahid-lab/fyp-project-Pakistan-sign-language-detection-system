/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../components/ThemeToggle";
import { Button, TabButton } from "../components/Button";

const API = "http://127.0.0.1:8000/api";
const TOTAL = 37;

const LABELS: string[] = [
  "ء","ا","ب","ت","ث","ج","ح","خ","د","ذ",
  "ر","ز","س","ش","ص","ض","ط","ظ","ع","غ",
  "ف","ق","ل","م","ن","و","ٹ","پ","چ","ڈ",
  "ژ","ک","گ","ں","ھ","ی","ے",
];

const normalize = (s: string) => s.replace(/‬/g, "").trim();

function pickRandom(exclude: number) {
  if (TOTAL <= 1) return 0;
  let n: number;
  do { n = Math.floor(Math.random() * TOTAL); } while (n === exclude);
  return n;
}

export default function LearnPage() {
  const [current, setCurrent] = useState(1);
  const [detecting, setDetecting] = useState(false);
  const [detectedLetter, setDetectedLetter] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Quiz mode
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showHint, setShowHint] = useState(false);
  const roundCorrectRef = useRef(false);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetLabel = quizMode ? LABELS[quizIndex] : LABELS[current - 1];
  const imageIndex = quizMode ? quizIndex + 1 : current;

  function nextQuizLetter(wasCorrect: boolean) {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    setScore(prev => ({ correct: prev.correct + (wasCorrect ? 1 : 0), total: prev.total + 1 }));
    setQuizIndex(prev => pickRandom(prev));
    setDetectedLetter("");
    setResult(null);
    setShowHint(false);
    roundCorrectRef.current = false;
  }

  function enterQuizMode() {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    setQuizMode(true);
    setQuizIndex(Math.floor(Math.random() * TOTAL));
    setScore({ correct: 0, total: 0 });
    setDetectedLetter("");
    setResult(null);
    setShowHint(false);
    roundCorrectRef.current = false;
  }

  function enterLearnMode() {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    setQuizMode(false);
    setDetectedLetter("");
    setResult(null);
    roundCorrectRef.current = false;
  }

  async function startCamera() {
    await fetch(`${API}/start-capture`, { method: "POST" }).catch(() => {});
    setDetecting(true);
    setDetectedLetter("");
    setResult(null);
  }

  async function stopCamera() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    await fetch(`${API}/stop-capture`, { method: "POST" }).catch(() => {});
    setDetecting(false);
    setDetectedLetter("");
    setResult(null);
  }

  useEffect(() => {
    if (!detecting) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API}/match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: 0, speech: 0 }),
        });
        const data = await res.json();
        if (data.label && data.label !== "no match" && data.label !== "no confidence") {
          const isCorrect = normalize(data.label) === normalize(targetLabel);
          setDetectedLetter(data.label);
          if (quizMode) {
            if (isCorrect && !roundCorrectRef.current) {
              roundCorrectRef.current = true;
              setResult("correct");
              autoAdvanceRef.current = setTimeout(() => nextQuizLetter(true), 1500);
            } else if (!isCorrect && !roundCorrectRef.current) {
              setResult("wrong");
            }
          } else {
            setResult(isCorrect ? "correct" : "wrong");
          }
        } else {
          setDetectedLetter("");
          if (!roundCorrectRef.current) setResult(null);
        }
      } catch { /* backend unreachable */ }
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [detecting, current, quizMode, quizIndex, targetLabel]);

  function next() {
    setCurrent(p => Math.min(p + 1, TOTAL));
    setDetectedLetter("");
    setResult(null);
  }

  function prev() {
    setCurrent(p => Math.max(p - 1, 1));
    setDetectedLetter("");
    setResult(null);
  }

  return (
    <main className="psl-main-fixed psl-learn-main" style={{ height: '100vh', overflow: 'hidden', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav className="psl-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="dot-accent" />
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>Learn Signs</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="badge psl-nav-badge">Pakistan Sign Language</div>
          <ThemeToggle />
          <button
            className="psl-hamburger"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 5h16M3 11h16M3 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="psl-body psl-learn-body" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT: Controls */}
        <div className="psl-sidebar psl-learn-sidebar" style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12, padding: 20, borderRight: '1px solid var(--border)', overflow: 'hidden' }}>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 8, padding: 3, border: '1px solid var(--border)', gap: 3 }}>
            <TabButton active={!quizMode} onClick={enterLearnMode}>Learn</TabButton>
            <TabButton active={quizMode} onClick={enterQuizMode}>Quiz</TabButton>
          </div>

          {/* Quiz score */}
          {quizMode && (
            <div className="dark-card" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--text-sub)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Score</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{score.correct} / {score.total}</span>
            </div>
          )}

          {/* Target letter */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {quizMode ? 'Sign This Letter' : 'Sign Letter'}
            </span>
            <div className="dark-card" style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', minHeight: 64 }}>
              <span style={{ fontSize: 44, fontWeight: 800, color: 'var(--text)', lineHeight: 1, direction: 'rtl' }}>
                {targetLabel}
              </span>
            </div>
          </div>

          {/* Detected letter */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Detected Letter</span>
            <div className="dark-card" style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', minHeight: 64 }}>
              <span style={{
                fontSize: 40, fontWeight: 700, lineHeight: 1, direction: 'rtl',
                color: result === 'correct' ? '#4ade80' : result === 'wrong' ? '#fb397d' : 'var(--text-ghost)',
              }}>
                {detectedLetter || '—'}
              </span>
            </div>
          </div>

          {/* Sign image */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Image of Sign</span>
              {quizMode ? (
                <Button variant="ghost" onClick={() => setShowHint(h => !h)}
                  style={{ fontSize: 12, color: showHint ? '#fb397d' : 'var(--text-muted)' }}>
                  {showHint ? 'Hide Hint' : 'Hint'}
                </Button>
              ) : (
                <span style={{ fontSize: 12, color: 'var(--text-sub)' }}>{current} / {TOTAL}</span>
              )}
            </div>
            <div className="dark-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, minHeight: 150, flex: 1 }}>
              {(!quizMode || showHint) ? (
                <Image
                  src={`/images/alphabet/${imageIndex}.png`}
                  alt={`Sign ${imageIndex}`}
                  width={160}
                  height={160}
                  style={{ objectFit: 'contain', maxHeight: '100%' }}
                />
              ) : (
                <span style={{ fontSize: 64, color: 'var(--text-ghost)', fontWeight: 300 }}>?</span>
              )}
            </div>
          </div>

          {/* Bottom buttons */}
          {quizMode ? (
            <Button variant="ghost" onClick={() => nextQuizLetter(false)}
              style={{ width: '100%', height: 42, border: '1px solid var(--border)' }}>
              Skip →
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Button onClick={prev} disabled={current === 1} style={{ flex: 1, height: 42 }}>
                ← Previous
              </Button>
              <Button onClick={next} disabled={current === TOTAL} style={{ flex: 1, height: 42 }}>
                Next →
              </Button>
            </div>
          )}

        </div>

        {/* RIGHT: Camera feed */}
        <div className="psl-feed psl-learn-feed" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'var(--bg)', gap: 16 }}>

          <div className="feed-box w-full psl-learn-cambox" style={{ maxWidth: 720, aspectRatio: '4/3', position: 'relative' }}>
            <span className="feed-label">Camera Feed</span>

            {detecting && (
              <span style={{ position: 'absolute', top: 14, right: 12, display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#fb397d', zIndex: 2 }}>
                LIVE
              </span>
            )}

            {detecting ? (
              <img src="http://127.0.0.1:8000/api/stream" alt="Live feed"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--text-ghost)' }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="2" y="10" width="44" height="32" rx="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="24" cy="26" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 10L19 4H29L32 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 13, letterSpacing: '0.05em' }}>Camera inactive</span>
                <span style={{ fontSize: 11, opacity: 0.6 }}>Press Start Camera to begin</span>
              </div>
            )}

            {result && (
              <div className="psl-result-overlay" style={{
                position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', alignItems: 'center', gap: 10,
                background: result === 'correct' ? 'rgba(34,197,94,0.15)' : 'rgba(251,57,125,0.15)',
                border: `1px solid ${result === 'correct' ? 'rgba(34,197,94,0.4)' : 'rgba(251,57,125,0.4)'}`,
                borderRadius: 10, padding: '10px 20px', zIndex: 5, whiteSpace: 'nowrap', width: 'max-content', maxWidth: '90%',
              }}>
                <Image src={result === 'correct' ? '/images/good.png' : '/images/bad.png'} alt={result} width={28} height={28} />
                <span style={{ fontSize: 16, fontWeight: 700, color: result === 'correct' ? '#4ade80' : '#fb397d' }}>
                  {result === 'correct' ? 'Correct!' : 'Not correct — keep trying'}
                </span>
              </div>
            )}
          </div>

          {/* Mobile Snapchat overlay */}
          <div className="psl-mob-controls" style={{
            position: 'absolute', inset: 0, zIndex: 10,
            flexDirection: 'column', pointerEvents: 'none',
          }}>
            {/* Top bar: Learn/Quiz tabs + score */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px',
              background: 'linear-gradient(rgba(0,0,0,0.55), transparent)',
              pointerEvents: 'auto',
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={enterLearnMode} style={{
                  background: !quizMode ? '#fff' : 'rgba(0,0,0,0.55)',
                  border: '1px solid rgba(255,255,255,0.18)', borderRadius: 20,
                  padding: '6px 14px', color: !quizMode ? '#000' : 'rgba(255,255,255,0.8)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>Learn</button>
                <button onClick={enterQuizMode} style={{
                  background: quizMode ? '#fff' : 'rgba(0,0,0,0.55)',
                  border: '1px solid rgba(255,255,255,0.18)', borderRadius: 20,
                  padding: '6px 14px', color: quizMode ? '#000' : 'rgba(255,255,255,0.8)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>Quiz</button>
              </div>
              {quizMode && (
                <span style={{
                  background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 20, padding: '6px 14px', color: '#fff', fontSize: 12, fontWeight: 700,
                }}>{score.correct} / {score.total}</span>
              )}
            </div>

            <div style={{ flex: 1 }} />

            {/* Sign image card — picture-in-picture style */}
            <div style={{ padding: '0 16px 10px', pointerEvents: 'auto' }}>
              <div style={{
                background: 'rgba(0,0,0,0.72)',
                border: `2px solid ${result === 'correct' ? 'rgba(74,222,128,0.55)' : result === 'wrong' ? 'rgba(251,57,125,0.45)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 16,
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                {/* Sign image */}
                <div style={{
                  width: 80, height: 80, flexShrink: 0, borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  {(!quizMode || showHint) ? (
                    <Image src={`/images/alphabet/${imageIndex}.png`} alt="Sign" width={80} height={80}
                      style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                  ) : (
                    <span style={{ fontSize: 40, color: 'rgba(255,255,255,0.15)', fontWeight: 300 }}>?</span>
                  )}
                </div>

                {/* Target letter + label */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                    {result === 'correct' ? '✓ Correct!' : result === 'wrong' ? '✗ Keep trying' : 'SIGN THIS'}
                  </div>
                  <div style={{
                    fontSize: 42, fontWeight: 800, direction: 'rtl', lineHeight: 1,
                    color: result === 'correct' ? '#4ade80' : result === 'wrong' ? '#fb397d' : '#fff',
                  }}>{targetLabel}</div>
                </div>

                {/* Divider */}
                <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />

                {/* Detected letter section */}
                <div style={{ textAlign: 'center', minWidth: 44, flexShrink: 0 }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>DETECTED</div>
                  <div style={{
                    fontSize: 32, fontWeight: 800, direction: 'rtl', lineHeight: 1,
                    color: result === 'correct' ? '#4ade80' : result === 'wrong' ? '#fb397d' : 'rgba(255,255,255,0.25)',
                  }}>{detectedLetter || '—'}</div>
                </div>

                {/* Hint button (quiz mode only) */}
                {quizMode && (
                  <button onClick={() => setShowHint(h => !h)} style={{
                    background: showHint ? '#fff' : 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                    color: showHint ? '#000' : '#fff', fontSize: 11, fontWeight: 600,
                    padding: '5px 10px', cursor: 'pointer', flexShrink: 0,
                  }}>Hint</button>
                )}
              </div>
            </div>

            {/* Bottom row: DETECTED | START/STOP | NEXT or SKIP */}
            <div style={{
              background: 'linear-gradient(transparent, rgba(0,0,0,0.78) 50%)',
              padding: '14px 28px 36px',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              pointerEvents: 'auto',
            }}>
              {/* Left: ← prev circle (learn) or spacer (quiz) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {!quizMode ? 'PREV' : ''}
                </span>
                {!quizMode ? (
                  <button onClick={prev} disabled={current === 1} style={{
                    width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
                    background: current === 1 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    color: current === 1 ? 'rgba(255,255,255,0.2)' : '#fff',
                    fontSize: 20, cursor: current === 1 ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>←</button>
                ) : (
                  <div style={{ width: 54, height: 54 }} />
                )}
              </div>

              {/* Center: START/STOP */}
              {!detecting ? (
                <button onClick={startCamera} style={{
                  width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
                  background: '#fff', border: '5px solid rgba(255,255,255,0.35)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#000', letterSpacing: '0.06em' }}>START</span>
                </button>
              ) : (
                <button onClick={stopCamera} style={{
                  width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
                  background: '#fff', border: '5px solid rgba(255,255,255,0.35)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                }}>
                  <span style={{ width: 24, height: 24, background: '#000', borderRadius: 4, display: 'block' }} />
                </button>
              )}

              {/* Right: NEXT (learn) or SKIP (quiz) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {quizMode ? 'SKIP' : 'NEXT'}
                </span>
                <button
                  onClick={quizMode ? () => nextQuizLetter(false) : next}
                  disabled={!quizMode && current === TOTAL}
                  style={{
                    width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
                    background: (!quizMode && current === TOTAL) ? 'rgba(255,255,255,0.08)' : '#fff',
                    border: '2px solid rgba(255,255,255,0.25)',
                    cursor: (!quizMode && current === TOTAL) ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: (!quizMode && current === TOTAL) ? 'rgba(255,255,255,0.3)' : '#000',
                  }}
                >
                  <span style={{ fontSize: 20, lineHeight: 1 }}>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop start/stop button */}
          <div style={{ width: '100%', maxWidth: 720 }}>
            {!detecting ? (
              <Button onClick={startCamera} style={{ width: '100%', height: 50 }}>Start Camera</Button>
            ) : (
              <Button variant="danger" onClick={stopCamera} style={{ width: '100%', height: 50 }}>Stop Camera</Button>
            )}
          </div>

        </div>
      </div>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 50,
          display: 'flex', flexDirection: 'column', padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="dot-accent" />
              <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 18, letterSpacing: '-0.02em' }}>PSL</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: 4 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M6 6l10 10M16 6L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          {[
            { href: '/about', label: 'About Us' },
            { href: '/contact', label: 'Contact Us' },
            { href: '/feedback', label: 'Feedback' },
            { href: '/dictionary', label: 'Dictionary' },
            { href: '/sign', label: 'Start Detection' },
            { href: '/learn', label: 'Learn Signs' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: 22, fontWeight: 600, color: 'var(--text)', textDecoration: 'none',
                padding: '16px 0', borderBottom: '1px solid var(--border-subtle)',
              }}>
              {label}
            </Link>
          ))}
          <div style={{ marginTop: 'auto', paddingTop: 24 }}>
            <ThemeToggle />
          </div>
        </div>
      )}
    </main>
  );
}
