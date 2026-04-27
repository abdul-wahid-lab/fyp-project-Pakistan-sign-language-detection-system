"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col">

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span className="dot-accent" />
          <span style={{ fontWeight: 700, color: '#fff', fontSize: 18, letterSpacing: '-0.02em' }}>PSL</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 13 }}>
          <Link href="/about" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>About Us</Link>
          <Link href="/contact" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}
          >Contact Us</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>Pakistan Sign Language</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: '72px 96px 48px', maxWidth: 900 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#fb397d', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          About the Project
        </span>
        <h1 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '16px 0 24px' }}>
          Making Pakistan Sign Language{' '}
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>Accessible to Everyone</span>
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 640 }}>
          This system uses computer vision and machine learning to detect and translate Pakistan Sign Language (PSL)
          gestures in real-time — helping bridge the communication gap between the deaf and hearing communities.
        </p>
      </div>

      {/* Cards */}
      <div style={{ padding: '0 96px 72px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900 }}>

        <div className="dark-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(251,57,125,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb397d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Real-Time Detection</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            Webcam-based detection runs at up to 30 FPS, recognising hand gestures with sub-second latency.
          </p>
        </div>

        <div className="dark-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(251,57,125,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb397d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>MLP Model</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            A Multi-Layer Perceptron trained on 42 MediaPipe hand landmark coordinates achieves 98.6% test accuracy across 36 Urdu letters.
          </p>
        </div>

        <div className="dark-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(251,57,125,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb397d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Urdu Speech Output</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            Detected signs are spoken aloud in Urdu using pre-recorded audio, making the system accessible without reading.
          </p>
        </div>

      </div>

      {/* Tech Stack */}
      <div style={{ padding: '0 96px 72px' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Technology Stack
        </span>
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          {['MediaPipe Hands', 'TensorFlow / Keras', 'FastAPI', 'Next.js 14', 'OpenCV', 'SQLite', 'StandardScaler', 'Python'].map(tech => (
            <span key={tech} style={{
              padding: '8px 16px', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500,
            }}>{tech}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '0 96px 72px', display: 'flex', gap: 64 }}>
        {[['98.6%', 'Test Accuracy'], ['36', 'Urdu Letters'], ['42', 'Landmark Features'], ['16,745', 'Training Samples']].map(([val, label]) => (
          <div key={label}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{val}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 'auto', padding: '18px 48px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 12, color: 'rgba(255,255,255,0.2)',
      }}>
        <span>PSL · Pakistan Sign Language System</span>
        <span>MediaPipe · Next.js · FastAPI</span>
      </div>

    </main>
  );
}
