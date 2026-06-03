"use client";
import { useState } from "react";
import Link from "next/link";
import ChromaKeyVideo from "./components/ChromaKeyVideo";
import { ThemeToggle } from "./components/ThemeToggle";
import { Button } from "./components/Button";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main style={{ background: 'var(--bg)', display: 'flex', flexDirection: 'column', position: 'relative', height: '100vh', overflow: 'hidden' }}>

      {/* Nav */}
      <nav className="psl-nav" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid var(--border-subtle)',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="dot-accent" />
          <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 18, letterSpacing: '-0.02em' }}>PSL</span>
        </div>
        <div className="psl-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 13 }}>
          <Link href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
          >About Us</Link>
          <Link href="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
          >Contact Us</Link>
          <Link href="/feedback" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
          >Feedback</Link>
          <Link href="/dictionary" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
          >Dictionary</Link>
          <span style={{ color: 'var(--text-faint)' }}>Pakistan Sign Language</span>
          <ThemeToggle />
        </div>
        <button
          className="psl-hamburger"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M3 5h16M3 11h16M3 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </nav>

      {/* Hero — two column */}
      <div className="psl-hero" style={{ flex: 1, display: 'flex', alignItems: 'stretch', width: '100%' }}>

        {/* LEFT: Text */}
        <div className="psl-hero-text" style={{
          flex: '0 0 50%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', gap: 32, padding: '60px 64px',
        }}>
          <h1 style={{
            fontSize: 'clamp(36px, 4vw, 62px)', fontWeight: 800,
            color: 'var(--text)', lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0,
          }}>
            Pakistan{' '}
            <span style={{ color: 'var(--text-faint)' }}>Sign Language</span>{' '}
            Detection
          </h1>

          <p style={{
            fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.75,
            maxWidth: 460, margin: 0,
          }}>
            Detect PSL gestures in real-time using your webcam.
            Powered by MediaPipe and machine learning translate
            hand signs into text instantly.
          </p>

          <div className="psl-hero-btns" style={{ display: 'flex', gap: 12 }}>
            <Link href="/sign" className="psl-hero-btn-link">
              <Button style={{ height: 50, fontSize: 14, width: '100%' }}>
                Start Detection
              </Button>
            </Link>
            <Link href="/learn" className="psl-hero-btn-link" style={{
              height: 50, minWidth: 140, fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--text-faint)', borderRadius: 8,
              color: 'var(--text)', cursor: 'pointer', textDecoration: 'none',
              background: 'transparent',
              transition: 'background 0.2s, color 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'var(--text)';
                el.style.color = 'var(--bg)';
                el.style.borderColor = 'var(--text)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'transparent';
                el.style.color = 'var(--text)';
                el.style.borderColor = 'var(--text-faint)';
              }}
            >
              Learn Signs
            </Link>
          </div>

          {/* Stats row */}
          <div className="psl-stats" style={{ display: 'flex', gap: 48 }}>
            {[['38', 'Letters'], ['6', 'Words'], ['Real-time', 'Detection'], ['Urdu', 'Speech Output']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>{val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Video */}
        <div className="psl-hero-video" style={{
          flex: '0 0 50%', display: 'flex', alignItems: 'flex-end',
          justifyContent: 'center', overflow: 'hidden', background: 'var(--bg)',
        }}>
          <ChromaKeyVideo maxHeight={680} />
        </div>

      </div>

      {/* Footer */}
      <div className="psl-footer" style={{
        padding: '18px 48px', borderTop: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 12, color: 'var(--text-faint)',
      }}>
        <span>PSL · Pakistan Sign Language System</span>
        <span>MediaPipe · Next.js · FastAPI</span>
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
