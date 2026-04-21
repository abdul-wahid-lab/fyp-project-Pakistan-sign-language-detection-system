"use client";

// CAPTURE FUNCTIONALITY DISABLED — code preserved for future use
// To re-enable: uncomment this page and add the link back in app/page.tsx

/*
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const API = "http://localhost:8000/api";

export default function CapturePage() {
  const [wordMode, setWordMode] = useState(false);
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const [capturing, setCapturing] = useState(false);

  async function captureDataset() {
    const secs = parseInt(duration) || 10;
    setCapturing(true);
    setStatus("Capturing…");
    await fetch(`${API}/start-capture`, { method: "POST" });
    setTimeout(async () => {
      await fetch(`${API}/stop-capture`, { method: "POST" });
      setCapturing(false);
      setStatus("Capture complete.");
    }, secs * 1000);
  }

  return (
    <section
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundImage: "url('/images/welcome-bg.png')", backgroundSize: "cover", backgroundPosition: "bottom center" }}
    >
      <div className="container mx-auto px-8 py-10">
        <div className="flex justify-between items-start mb-10">
          <div className="relative">
            <span className="watermark">Capture</span>
            <div className="relative z-10">
              <h2 className="text-5xl font-bold text-white">Capture New Data</h2>
              <p className="text-white/70 mt-1">Extend PSL dataset by capturing new data</p>
              <h3 className="text-white/80 mt-1">Pakistan Sign Language</h3>
            </div>
          </div>
          <Link href="/">
            <Image src="/images/back.png" alt="Back" width={75} height={75} className="cursor-pointer hover:opacity-80" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-10 items-start">
          <div className="flex flex-col gap-5 min-w-[280px]">
            <label className="flex items-center gap-3 text-white cursor-pointer mt-8">
              <input type="checkbox" checked={wordMode} onChange={e => setWordMode(e.target.checked)}
                className="w-5 h-5 accent-pink-500" />
              Word Mode
            </label>

            <div className="flex flex-col gap-2 mt-5">
              <label className="text-white font-semibold">Enter Duration of Capture:</label>
              <input
                type="text"
                placeholder="Seconds"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 w-40"
              />
              <div className="flex gap-3 mt-2">
                <button onClick={captureDataset} disabled={capturing} className="psl-btn disabled:opacity-50">
                  Start Capture
                </button>
              </div>
              {status && <p className="text-white/70 text-sm mt-2">{status}</p>}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-2" style={{ marginTop: -100 }}>
            {capturing ? (
              <img src="http://localhost:8000/api/stream" alt="Live feed" width={550} height={350} style={{ borderRadius: 8 }} />
            ) : (
              <Image src="/images/BLACK_background.jpg" alt="Camera off" width={550} height={350} style={{ borderRadius: 8 }} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
*/

import Link from "next/link";

export default function CapturePage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white/30">
      <p className="text-sm">Capture feature is currently disabled.</p>
      <Link href="/" className="text-white/50 hover:text-white text-sm underline">Go home</Link>
    </main>
  );
}
