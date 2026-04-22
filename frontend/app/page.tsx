"use client";
import Link from "next/link";
import ChromaKeyVideo from "./components/ChromaKeyVideo";

export default function Home() {
  return (
    <main className="bg-black flex flex-col" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="dot-accent" />
          <span style={{ fontWeight: 700, color: '#fff', fontSize: 18, letterSpacing: '-0.02em' }}>PSL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          <span>Pakistan Sign Language</span>
        </div>
      </nav>

      {/* Hero — two column */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', width: '100%' }}>

        {/* LEFT: Text */}
        <div style={{
          flex: '0 0 50%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', gap: 32, padding: '60px 64px',
        }}>
          <h1 style={{
            fontSize: 'clamp(36px, 4vw, 62px)', fontWeight: 800,
            color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0,
          }}>
            Pakistan{' '}
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>Sign Language</span>{' '}
            Detection
          </h1>

          <p style={{
            fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75,
            maxWidth: 460, margin: 0,
          }}>
            Detect PSL gestures in real-time using your webcam.
            Powered by MediaPipe and machine learning — translate
            hand signs into text instantly.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/sign">
              <button className="psl-btn" style={{ height: 50, minWidth: 170, fontSize: 14 }}>
                Start Detection
              </button>
            </Link>
            <a href="#learn" style={{
              height: 50, minWidth: 140, fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer', textDecoration: 'none',
              transition: 'border-color 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >
              Learn Signs
            </a>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 48 }}>
            {[['38', 'Letters'], ['Real-time', 'Detection'], ['Urdu', 'Speech Output']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Video */}
        <div style={{
          flex: '0 0 50%', display: 'flex', alignItems: 'flex-end',
          justifyContent: 'center', overflow: 'hidden', background: '#000',
        }}>
          <ChromaKeyVideo maxHeight={680} />
        </div>

      </div>

      {/* Footer */}
      <div style={{
        padding: '18px 48px', borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 12, color: 'rgba(255,255,255,0.2)',
      }}>
        <span>PSL · Pakistan Sign Language System</span>
        <span>MediaPipe · Next.js · FastAPI</span>
      </div>

    </main>
  );
}
