"use client";
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Logo, HandSkeleton } from '../components/ls/Components';
import * as I from '../components/ls/Icons';

const URDU_FLOATS = ['ا', 'ب', 'پ'];

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function AuthPage() {
  return (
    <div className="ls-scope" style={{ height: '100vh', background: 'var(--bg)' }}>
      <div className="ls-auth">
        {/* LEFT brand */}
        <div className="ls-auth-brand">
          <Link href="/" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontWeight: 600, fontSize: 14.5, opacity: 0.92 }}>
            <I.ArrowLeft size={18} /> Back home
          </Link>
          <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
            <div style={{ position: 'relative', width: 240 }}>
              {URDU_FLOATS.map((c, k) => (
                <div key={k} className="floaty" style={{
                  position: 'absolute', fontFamily: 'var(--font-urdu)', fontSize: 24, fontWeight: 700, color: 'white',
                  width: 50, height: 50, display: 'grid', placeItems: 'center', borderRadius: 15,
                  background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)',
                  top: ['-6%', '60%', '8%'][k], left: ['-16%', '-12%', '104%'][k], animationDelay: `${k * 0.8}s`,
                }}>{c}</div>
              ))}
              <div style={{ borderRadius: 30, overflow: 'hidden', aspectRatio: '4/5', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)', border: '5px solid rgba(255,255,255,0.25)', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '16% 24% 24%', opacity: 0.95 }}>
                  <HandSkeleton color="white" accent="oklch(0.85 0.18 100)" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: 30, marginBottom: 10, fontFamily: 'var(--font-display)' }}>Every sign matters.</h2>
            <p style={{ color: 'white', opacity: 0.88, fontSize: 16, maxWidth: 360 }}>Join the community making Pakistan Sign Language understood everywhere — one conversation at a time.</p>
          </div>
        </div>

        {/* RIGHT form */}
        <div className="ls-auth-form">
          <div style={{ width: '100%', maxWidth: 400 }}>
            <div style={{ marginBottom: 32 }}><Logo size={34} /></div>

            <h1 style={{ fontSize: 32, marginBottom: 8 }}>Welcome to LinguaSign</h1>
            <p style={{ color: 'var(--ink-soft)', marginBottom: 32, fontSize: 15.5, lineHeight: 1.6 }}>
              Sign in to save your progress, streaks, and learning history. All pages work without an account too.
            </p>

            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                padding: '14px 20px', borderRadius: 'var(--radius)',
                border: '1.5px solid var(--line)', background: 'var(--surface)',
                color: 'var(--ink)', fontSize: 15.5, fontWeight: 600, fontFamily: 'var(--font-display)',
                cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLElement).style.background = 'var(--green-soft)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13.5, color: 'var(--ink-faint)', lineHeight: 1.6 }}>
              By continuing, you agree to our{' '}
              <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Terms</a>
              {' '}and{' '}
              <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Privacy Policy</a>.
              <br />No password needed — Google handles it securely.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '28px 0 20px' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              <span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            </div>

            <Link href="/sign" style={{
              display: 'block', textAlign: 'center', padding: '13px 20px',
              borderRadius: 'var(--radius)', border: '1.5px solid var(--line)',
              color: 'var(--ink-soft)', fontSize: 15, fontWeight: 500,
              textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--ink)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--ink-soft)'}
            >
              Continue as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
