"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const API = "http://127.0.0.1:8000/api";

export default function SignPage() {
  const [speech, setSpeech] = useState(false);
  const [wordMode, setWordMode] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const cooldown = 1000;
  const [currentLetter, setCurrentLetter] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [sentence, setSentence] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastLetterRef = useRef("");

  async function startDetection() {
    await fetch(`${API}/start-capture`, { method: "POST" });
    setDetecting(true);
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
          body: JSON.stringify({ mode: wordMode ? 1 : 0, speech: speech ? 1 : 0 }),
        });
        const data = await res.json();
        if (data.label !== "no match" && data.label !== "no confidence") {
          const letter = data.label;
          if (letter !== lastLetterRef.current) {
            lastLetterRef.current = letter;
            setCurrentLetter(letter);
          }
        }
      } catch { /* backend unreachable */ }
    }, cooldown);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [detecting, wordMode, speech, cooldown]);

  function acceptLetter() {
    if (!currentLetter) return;
    setCurrentWord(prev => prev + currentLetter);
    setCurrentLetter("");
    lastLetterRef.current = "";
  }

  async function speakWord(word: string) {
    if (!word) return;
    const url = `http://127.0.0.1:8000/audio/${encodeURIComponent(word)}.mp3`;
    await new Promise<void>(resolve => {
      const audio = new Audio(url);
      audio.onended = () => resolve();
      audio.onerror = () => {
        fetch(`${API}/log-missing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word }),
        }).catch(() => {});
        resolve();
      };
      audio.play().catch(() => resolve());
    });
  }

  async function speakSentence(words: string[]) {
    for (const word of words) {
      await speakWord(word);
    }
  }

  function addWord() {
    if (!currentWord) return;
    setSentence(prev => [...prev, currentWord]);
    setCurrentWord("");
    setCurrentLetter("");
    lastLetterRef.current = "";
  }

  function deleteLetter() {
    setCurrentWord(prev => [...prev].slice(0, -1).join(""));
    lastLetterRef.current = "";
  }

  function removeWord(index: number) {
    setSentence(prev => prev.filter((_, i) => i !== index));
  }

  function copyToClipboard() {
    if (!sentence.length) return;
    navigator.clipboard.writeText(sentence.join(" ")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleStop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDetecting(false);
    setCurrentLetter("");
    await fetch(`${API}/stop-capture`, { method: "POST" }).catch(() => {});
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
          <span className="font-bold text-white tracking-tight">Sign Detection</span>
        </div>
        <div className="badge">Pakistan Sign Language</div>
      </nav>

      {/* Body */}
      <div className="flex flex-1 gap-0 overflow-hidden">

        {/* ── LEFT: Controls ───────────────────────────────────────────────── */}
        <div className="w-[400px] flex-shrink-0 flex flex-col gap-5 p-8 border-r border-white/8 overflow-y-auto">

          {/* Status */}
          <div className="flex items-center gap-2">
            {detecting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#fb397d', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fb397d', display: 'inline-block', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
                LIVE
              </span>
            ) : (
              <span className="badge">Idle</span>
            )}
          </div>

          {/* Toggles */}
          <div className="dark-card" style={{ padding: 0 }}>
            <div className="toggle-row" style={{ padding: '14px 20px' }}>
              <label htmlFor="speech">Enable Speech</label>
              <input id="speech" type="checkbox" className="toggle" checked={speech}
                onChange={e => setSpeech(e.target.checked)} />
            </div>
            <div className="toggle-row" style={{ padding: '14px 20px', borderBottom: 'none' }}>
              <label htmlFor="wordMode">Word Mode</label>
              <input id="wordMode" type="checkbox" className="toggle" checked={wordMode}
                onChange={e => setWordMode(e.target.checked)} />
            </div>
          </div>


          {/* Current Letter */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Detected Letter</span>
            <div className="dark-card flex items-center justify-center" style={{ padding: '18px 20px' }}>
              <span style={{ fontSize: 48, fontWeight: 700, color: currentLetter ? '#fff' : 'rgba(255,255,255,0.1)', lineHeight: 1, direction: 'rtl' }}>
                {currentLetter || '—'}
              </span>
            </div>
            <button
              onClick={acceptLetter}
              disabled={!currentLetter}
              className="psl-btn"
              style={{ width: '100%', height: 50, opacity: currentLetter ? 1 : 0.3, cursor: currentLetter ? 'pointer' : 'not-allowed' }}>
              Accept Letter
            </button>
            <button
              onClick={() => {
                if (!currentLetter) return;
                setSentence(prev => [...prev, currentLetter]);
                setCurrentLetter("");
                lastLetterRef.current = "";
              }}
              disabled={!currentLetter}
              className="psl-btn"
              style={{ width: '100%', height: 50, opacity: currentLetter ? 1 : 0.3, cursor: currentLetter ? 'pointer' : 'not-allowed' }}>
              Add Letter to Sentence
            </button>
          </div>

          {/* Current Word being built */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Current Word</span>
              {currentWord && (
                <button onClick={deleteLetter}
                  style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', cursor: 'pointer', background: 'none', border: 'none' }}
                  className="hover:text-white transition-colors">
                  ← Delete
                </button>
              )}
            </div>
            <div className="dark-card" style={{ padding: '14px 20px', minHeight: 56, direction: 'rtl', textAlign: 'right' }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: currentWord ? '#fff' : 'rgba(255,255,255,0.1)', letterSpacing: '0.05em' }}>
                {currentWord || '—'}
              </span>
            </div>
            <button
              onClick={addWord}
              disabled={!currentWord}
              className="psl-btn"
              style={{ width: '100%', height: 50, opacity: currentWord ? 1 : 0.3, cursor: currentWord ? 'pointer' : 'not-allowed' }}>
              Add Word to Sentence
            </button>
          </div>

          {/* Sentence output */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Sentence</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {sentence.length > 0 && (
                  <>
                    <button onClick={copyToClipboard}
                      style={{ fontSize: 12, color: copied ? '#fb397d' : 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                      className="hover:text-white transition-colors">
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={() => setSentence([])}
                      style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}
                      className="hover:text-white transition-colors">
                      Clear
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="dark-card" style={{ padding: 16, minHeight: 80, direction: 'rtl', textAlign: 'right' }}>
              {sentence.length === 0
                ? <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>جملہ یہاں ظاہر ہوگا…</span>
                : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end' }}>
                    {sentence.map((word, i) => (
                      <span key={i}
                        onClick={() => removeWord(i)}
                        title="Click to remove"
                        style={{
                          fontSize: 20, fontWeight: 600, color: '#fff', cursor: 'pointer',
                          padding: '2px 6px', borderRadius: 4,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(251,57,125,0.25)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
              }
            </div>
            <button
              onClick={() => speakSentence(sentence)}
              disabled={sentence.length === 0}
              className="psl-btn"
              style={{ width: '100%', height: 50, opacity: sentence.length > 0 ? 1 : 0.3, cursor: sentence.length > 0 ? 'pointer' : 'not-allowed' }}>
              Speak Sentence
            </button>
          </div>

        </div>

        {/* ── RIGHT: Camera feed ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black gap-4">
          <div className="feed-box w-full" style={{ maxWidth: 720, aspectRatio: '4/3' }}>
            <span className="feed-label">Camera Feed</span>
            {detecting && (
              <span style={{ position: 'absolute', top: 14, right: 12, display: 'flex', alignItems: 'center',
                gap: 5, fontSize: 11, fontWeight: 600, color: '#fb397d', zIndex: 2 }}>
                LIVE
              </span>
            )}
            {detecting ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src="http://127.0.0.1:8000/api/stream" alt="Live feed"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 12, color: 'rgba(255,255,255,0.15)' }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="2" y="10" width="44" height="32" rx="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="24" cy="26" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 10L19 4H29L32 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 13, letterSpacing: '0.05em' }}>Camera inactive</span>
                <span style={{ fontSize: 11, opacity: 0.6 }}>Press Start Detection to begin</span>
              </div>
            )}
          </div>

          {/* Start / Stop */}
          <div style={{ width: '100%', maxWidth: 720 }}>
            {!detecting ? (
              <button onClick={startDetection} className="psl-btn" style={{ width: '100%', height: 50 }}>
                Start Detection
              </button>
            ) : (
              <button onClick={handleStop} className="psl-btn danger" style={{ width: '100%', height: 50 }}>
                Stop Detection
              </button>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
