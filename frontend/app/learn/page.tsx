/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const API = "http://127.0.0.1:8000/api";
const TOTAL = 36;

const LABELS: string[] = [
  "ء","ا","ب","ت","ث","ح","خ","د","ذ","ر",
  "ز","س","ش","ص","ض","ط","ظ","ع","غ","ف",
  "ق","ل","م","ن","و","ٹ","پ","چ","ڈ","ژ",
  "ک","گ","ں","ھ","ی","ے",
];

export default function LearnPage() {
  const [current, setCurrent] = useState(1);
  const [detecting, setDetecting] = useState(false);
  const [detectedLetter, setDetectedLetter] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function startCamera() {
    await fetch(`${API}/start-capture`, { method: "POST" }).catch(() => {});
    setDetecting(true);
    setDetectedLetter("");
    setResult(null);
  }

  async function stopCamera() {
    if (intervalRef.current) clearInterval(intervalRef.current);
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
          setDetectedLetter(data.label);
          setResult(data.label === LABELS[current - 1] ? "correct" : "wrong");
        } else {
          setDetectedLetter("");
          setResult(null);
        }
      } catch { /* backend unreachable */ }
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [detecting, current]);

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
    <main className="min-h-screen bg-black flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-5 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>
        <div className="flex items-center gap-2">
          <span className="dot-accent" />
          <span className="font-bold text-white tracking-tight">Learn Signs</span>
        </div>
        <div className="badge">Pakistan Sign Language</div>
      </nav>

      {/* Body */}
      <div className="flex flex-1 gap-0 overflow-hidden">

        {/* LEFT: Sign display */}
        <div className="w-[380px] flex-shrink-0 flex flex-col gap-5 p-8 border-r border-white/8">

          {/* Expected letter */}
          <div>
            <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Sign Letter</span>
            <div className="dark-card mt-2 flex items-center justify-center" style={{ padding: '18px 20px', minHeight: 80 }}>
              <span style={{ fontSize: 56, fontWeight: 800, color: '#fff', lineHeight: 1, direction: 'rtl' }}>
                {LABELS[current - 1]}
              </span>
            </div>
          </div>

          {/* Detected letter */}
          <div>
            <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Detected Letter</span>
            <div className="dark-card mt-2 flex items-center justify-center" style={{ padding: '18px 20px', minHeight: 80 }}>
              <span style={{
                fontSize: 48, fontWeight: 700, lineHeight: 1, direction: 'rtl',
                color: result === 'correct' ? '#4ade80' : result === 'wrong' ? '#fb397d' : 'rgba(255,255,255,0.15)',
              }}>
                {detectedLetter || '—'}
              </span>
            </div>
          </div>

          {/* Sign image */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Image of Sign</span>
              <span className="text-xs text-white/30">{current} / {TOTAL}</span>
            </div>
            <div className="dark-card flex items-center justify-center" style={{ padding: 16, minHeight: 200 }}>
              <Image
                src={`/images/alphabet/${current}.png`}
                alt={`Sign ${current}`}
                width={200}
                height={200}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Next / Prev */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={prev}
              disabled={current === 1}
              className="psl-btn"
              style={{ flex: 1, height: 48, opacity: current === 1 ? 0.3 : 1, cursor: current === 1 ? 'not-allowed' : 'pointer' }}
            >
              ← Previous
            </button>
            <button
              onClick={next}
              disabled={current === TOTAL}
              className="psl-btn"
              style={{ flex: 1, height: 48, opacity: current === TOTAL ? 0.3 : 1, cursor: current === TOTAL ? 'not-allowed' : 'pointer' }}
            >
              Next →
            </button>
          </div>

        </div>

        {/* RIGHT: Camera feed */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black gap-4">

          <div className="feed-box w-full" style={{ maxWidth: 720, aspectRatio: '4/3', position: 'relative' }}>
            <span className="feed-label">Camera Feed</span>

            {detecting && (
              <span style={{ position: 'absolute', top: 14, right: 12, display: 'flex', alignItems: 'center',
                gap: 5, fontSize: 11, fontWeight: 600, color: '#fb397d', zIndex: 2 }}>
                LIVE
              </span>
            )}

            {detecting ? (
              <img
                src="http://127.0.0.1:8000/api/stream"
                alt="Live feed"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 12, color: 'rgba(255,255,255,0.15)' }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="2" y="10" width="44" height="32" rx="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="24" cy="26" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 10L19 4H29L32 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 13, letterSpacing: '0.05em' }}>Camera inactive</span>
                <span style={{ fontSize: 11, opacity: 0.6 }}>Press Start Camera to begin</span>
              </div>
            )}

            {/* Result overlay on camera */}
            {result && (
              <div style={{
                position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', alignItems: 'center', gap: 10,
                background: result === 'correct' ? 'rgba(34,197,94,0.15)' : 'rgba(251,57,125,0.15)',
                border: `1px solid ${result === 'correct' ? 'rgba(34,197,94,0.4)' : 'rgba(251,57,125,0.4)'}`,
                borderRadius: 10, padding: '10px 20px', zIndex: 5, whiteSpace: 'nowrap',
              }}>
                <Image
                  src={result === 'correct' ? '/images/good.png' : '/images/bad.png'}
                  alt={result}
                  width={28}
                  height={28}
                />
                <span style={{ fontSize: 16, fontWeight: 700, color: result === 'correct' ? '#4ade80' : '#fb397d' }}>
                  {result === 'correct' ? 'Correct!' : 'Not correct — keep trying'}
                </span>
              </div>
            )}
          </div>

          {/* Start / Stop */}
          <div style={{ width: '100%', maxWidth: 720 }}>
            {!detecting ? (
              <button onClick={startCamera} className="psl-btn" style={{ width: '100%', height: 50 }}>
                Start Camera
              </button>
            ) : (
              <button onClick={stopCamera} className="psl-btn danger" style={{ width: '100%', height: 50 }}>
                Stop Camera
              </button>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
