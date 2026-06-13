"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo, HandSkeleton } from '../components/ls/Components';
import * as I from '../components/ls/Icons';

const URDU_FLOATS = ['ا','ب','پ'];

function Field({ label, type = 'text', placeholder, Icon }: { label: string; type?: string; placeholder: string; Icon?: React.FC<I.IconProps> }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 7 }}>{label}</span>
      <div style={{ position: 'relative' }}>
        {Icon && <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)' }}><Icon size={19} /></span>}
        <input type={type} placeholder={placeholder} style={{
          width: '100%', padding: Icon ? '14px 16px 14px 44px' : '14px 16px', borderRadius: 'var(--radius)',
          border: '1.5px solid var(--line)', background: 'var(--surface-2)', color: 'var(--ink)', fontSize: 15.5, outline: 'none',
          transition: 'border-color 0.2s, background 0.2s',
        }}
          onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'var(--surface)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--line)'; e.target.style.background = 'var(--surface-2)'; }}
        />
      </div>
    </label>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState<'signup'|'login'>('signup');
  const router = useRouter();
  const isSignup = mode === 'signup';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push('/dashboard');
  }

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
              {URDU_FLOATS.map((c,k) => (
                <div key={k} className="floaty" style={{
                  position: 'absolute', fontFamily: 'var(--font-urdu)', fontSize: 24, fontWeight: 700, color: 'white',
                  width: 50, height: 50, display: 'grid', placeItems: 'center', borderRadius: 15,
                  background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)',
                  top: ['-6%','60%','8%'][k], left: ['-16%','-12%','104%'][k], animationDelay: `${k*0.8}s`,
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
            <div style={{ marginBottom: 26 }}><Logo size={34} /></div>
            <div style={{ display: 'flex', gap: 6, padding: 5, background: 'var(--surface-2)', borderRadius: 999, marginBottom: 28, width: 'fit-content' }}>
              {(['signup','login'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} style={{
                  padding: '9px 22px', borderRadius: 999, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5, whiteSpace: 'nowrap',
                  background: mode===m ? 'var(--surface)' : 'transparent', color: mode===m ? 'var(--ink)' : 'var(--ink-faint)',
                  boxShadow: mode===m ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s',
                }}>{m === 'signup' ? 'Sign up' : 'Log in'}</button>
              ))}
            </div>
            <h1 style={{ fontSize: 32, marginBottom: 8 }}>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
            <p style={{ color: 'var(--ink-soft)', marginBottom: 26, fontSize: 15.5 }}>
              {isSignup ? 'Start translating and learning PSL for free.' : 'Pick up right where you left off.'}
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
              {isSignup && <Field label="Full name" placeholder="Ayesha Khan" Icon={I.User} />}
              <Field label="Email" type="email" placeholder="you@email.com" Icon={I.Globe} />
              <Field label="Password" type="password" placeholder="••••••••" Icon={I.Bolt} />
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}>
                {isSignup ? 'Create account' : 'Log in'} <I.ArrowRight size={19} />
              </button>
            </form>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '22px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              <span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {['Google','Apple'].map(p => (
                <button key={p} className="btn btn-ghost" style={{ flex: 1 }} onClick={() => router.push('/dashboard')}>{p}</button>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14.5, color: 'var(--ink-soft)' }}>
              {isSignup ? 'Already have an account? ' : 'New to LinguaSign? '}
              <button onClick={() => setMode(isSignup ? 'login' : 'signup')} style={{ color: 'var(--primary)', fontWeight: 700 }}>
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
