"use client";

// LEARN/TRAIN FUNCTIONALITY DISABLED — code preserved for future use
// To re-enable: uncomment this page and add the link back in app/page.tsx

/*
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const ALPHABET_COUNT = 36;

export default function LearnPage() {
  const [current, setCurrent] = useState(1);
  const [learning, setLearning] = useState(false);

  function startLearning() {
    setLearning(true);
    setCurrent(1);
  }

  function skipSign() {
    setCurrent(prev => Math.min(prev + 1, ALPHABET_COUNT));
  }

  return (
    <section
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundImage: "url('/images/welcome-bg.png')", backgroundSize: "cover", backgroundPosition: "bottom center" }}
    >
      <div className="container mx-auto px-8 py-10">
        <div className="flex justify-between items-start mb-10">
          <div className="relative">
            <span className="watermark">Learn</span>
            <div className="relative z-10">
              <h2 className="text-5xl font-bold text-white flex items-center gap-4">
                Sign Detection
                <Image src="/images/recog.png" alt="" width={300} height={40} className="inline-block" />
              </h2>
              <h3 className="text-white/80 mt-1">Sign Language</h3>
              <p className="text-white/60 text-sm mt-1">Detect Sign Language using Simple WebCam</p>
            </div>
          </div>
          <Link href="/">
            <Image src="/images/back.png" alt="Back" width={75} height={75} className="cursor-pointer hover:opacity-80" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-10 items-start mt-10">
          <div className="flex flex-col gap-5 min-w-[280px]">
            <button onClick={startLearning} className="psl-btn w-fit">
              Start Learning
            </button>
            <Image
              src={`/images/alphabet/${current}.png`}
              alt={`Alphabet ${current}`}
              width={250}
              height={250}
            />
          </div>

          <div className="flex flex-col items-center gap-4" style={{ marginTop: -40 }}>
            {learning ? (
              <img src="http://localhost:8000/api/stream" alt="Live feed" width={550} height={350} style={{ borderRadius: 8 }} />
            ) : (
              <Image src="/images/BLACK_background.jpg" alt="Camera off" width={550} height={350} style={{ borderRadius: 8 }} />
            )}
            <button onClick={skipSign} className="psl-btn w-fit">
              Skip Sign
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
*/

import Link from "next/link";

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white/30">
      <p className="text-sm">Learn feature is currently disabled.</p>
      <Link href="/" className="text-white/50 hover:text-white text-sm underline">Go home</Link>
    </main>
  );
}
