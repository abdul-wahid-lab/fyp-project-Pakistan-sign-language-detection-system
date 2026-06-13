"use client";
import { LsPublicNav, LsFooter } from '../components/ls/Components';

const TECH = ['MediaPipe Hands', 'TensorFlow / Keras', 'FastAPI', 'Next.js 14', 'OpenCV', 'SQLite', 'StandardScaler', 'Python'];
const STATS = [['98.6%', 'Test Accuracy'], ['37', 'Urdu Letters'], ['42', 'Landmark Features'], ['16,745', 'Training Samples']];
const FEATURES = [
  {
    color: 'green',
    path: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
    extra: <circle cx="12" cy="12" r="3"/>,
    title: 'Real-Time Detection',
    desc: 'Webcam-based detection runs at up to 30 FPS, recognising hand gestures with sub-second latency using MediaPipe hand landmarks.',
  },
  {
    color: 'violet',
    path: 'M22 12 18 12 15 21 9 3 6 12 2 12',
    title: 'MLP Neural Network',
    desc: 'A Multi-Layer Perceptron trained on 42 landmark coordinates achieves 98.6% test accuracy across 37 Urdu letters.',
    isPolyline: true,
  },
  {
    color: 'sky',
    path: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    title: 'Urdu Speech Output',
    desc: 'Detected signs are spoken aloud in Urdu using pre-recorded audio, making the system accessible without reading.',
  },
];

export default function AboutPage() {
  return (
    <div className="ls-scope ls-pub-page">
      <LsPublicNav active="/about" />

      <div style={{ padding: 'clamp(48px,6vw,88px) clamp(20px,5vw,96px) 0', maxWidth: 960, width: '100%' }}>

        {/* Hero */}
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          About the Project
        </span>
        <h1 style={{ fontSize: 'clamp(28px,3.5vw,52px)', margin: '16px 0 20px' }}>
          Making Pakistan Sign Language{' '}
          <span style={{ color: 'var(--ink-faint)' }}>Accessible to Everyone</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: 680, marginBottom: 60 }}>
          This system uses computer vision and machine learning to detect and translate Pakistan Sign Language (PSL)
          gestures in real-time — helping bridge the communication gap between the deaf and hearing communities.
        </p>

        {/* Feature cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 56 }}>
          {FEATURES.map(({ color, path, extra, title, desc, isPolyline }) => (
            <div key={title} className="card" style={{ padding: 28 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: `var(--${color}-soft)`, color: `var(--${color})`, display: 'grid', placeItems: 'center', marginBottom: 18 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isPolyline ? <polyline points={path}/> : <path d={path}/>}
                  {extra}
                </svg>
              </div>
              <h3 style={{ fontSize: 17, marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Technology Stack
          </span>
          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            {TECH.map(t => (
              <span key={t} style={{ padding: '8px 16px', borderRadius: 999, border: '1.5px solid var(--line)', fontSize: 13, color: 'var(--ink-soft)', fontFamily: 'var(--font-display)', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 80 }}>
          {STATS.map(([val, label]) => (
            <div key={label} className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 34, color: 'var(--primary)', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-faint)', marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>

      </div>

      <LsFooter />
    </div>
  );
}
