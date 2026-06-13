"use client";
import { useState } from 'react';
import { AppShell, TopBar, Avatar } from '../components/ls/Components';
import { LsThemeToggle } from '../components/ls/Components';
import * as I from '../components/ls/Icons';

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ width: 50, height: 28, borderRadius: 999, position: 'relative', flexShrink: 0, background: on ? 'var(--primary)' : 'var(--surface-2)', transition: 'background 0.25s', boxShadow: 'inset 0 1px 4px oklch(0 0 0 / 0.1)' }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 25 : 3, width: 22, height: 22, borderRadius: 999, background: 'white', transition: 'left 0.25s var(--ease)', boxShadow: '0 1px 4px oklch(0 0 0 / 0.25)' }} />
    </button>
  );
}

function Segmented({ value, set, opts }: { value: string; set: (v: string) => void; opts: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: 'var(--surface-2)' }}>
      {opts.map(o => (
        <button key={o} onClick={() => set(o)} style={{ padding: '7px 15px', borderRadius: 999, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5, background: value===o ? 'var(--surface)' : 'transparent', color: value===o ? 'var(--ink)' : 'var(--ink-faint)', boxShadow: value===o ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}>{o}</button>
      ))}
    </div>
  );
}

function Row({ Icon, color, title, sub, control, onClick }: { Icon: React.FC<I.IconProps>; color: string; title: string; sub?: string; control?: React.ReactNode; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '15px 4px', cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ width: 42, height: 42, borderRadius: 13, background: `var(--${color}-soft)`, color: `var(--${color})`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon size={21} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15.5 }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: 'var(--ink-faint)' }}>{sub}</div>}
      </div>
      {control}
    </div>
  );
}

const Divider = () => <div style={{ height: 1, background: 'var(--line)' }} />;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: '8px 22px 14px' }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '16px 4px 6px' }}>{title}</div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [voice, setVoice]           = useState(true);
  const [captions, setCaptions]     = useState(true);
  const [reminders, setReminders]   = useState(false);
  const [bigText, setBigText]       = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [lang, setLang]             = useState('Urdu');
  const [hand, setHand]             = useState('Right');

  return (
    <AppShell>
      <div className="ls-page">
        <TopBar title="Settings" sub="Personalise LinguaSign for you" />
        <div style={{ padding: 'clamp(20px,3vw,34px)', maxWidth: 1100 }}>
          <div className="ls-settings-grid">

            {/* Profile card */}
            <div className="card" style={{ padding: 28, textAlign: 'center', position: 'sticky', top: 90 }}>
              <div style={{ display: 'grid', placeItems: 'center', marginBottom: 14 }}>
                <Avatar name="Guest User" size={88} ring />
              </div>
              <h2 style={{ fontSize: 23 }}>Guest User</h2>
              <p style={{ color: 'var(--ink-faint)', fontSize: 14, marginBottom: 16 }}>guest@linguasign.app</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
                <span className="chip" style={{ background: 'var(--amber-soft)', color: 'var(--ink)' }}><I.Trophy size={14} /> Level 4</span>
                <span className="chip" style={{ background: 'var(--coral-soft)', color: 'var(--ink)' }}><I.Flame size={14} /> 12 days</span>
              </div>
              <button className="btn btn-soft" style={{ width: '100%' }}>Edit profile</button>
              <button className="btn btn-ghost" style={{ width: '100%', marginTop: 10, color: 'var(--coral)' }}>
                <I.Logout size={18} /> Log out
              </button>
            </div>

            {/* Settings sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Section title="Detection">
                <Row Icon={I.Volume} color="green"  title="Voice output"    sub="Speak translations aloud"  control={<Toggle on={voice}    onClick={() => setVoice(v => !v)} />} />
                <Divider />
                <Row Icon={I.Mic}    color="sky"    title="Live captions"   sub="Show text on the camera"   control={<Toggle on={captions} onClick={() => setCaptions(v => !v)} />} />
                <Divider />
                <Row Icon={I.Hand}   color="violet" title="Dominant hand"   sub="Tune tracking accuracy"    control={<Segmented value={hand} set={setHand} opts={['Left','Right']} />} />
              </Section>

              <Section title="Language">
                <Row Icon={I.Globe}  color="sky"    title="Translation language" sub="Output for detected signs" control={<Segmented value={lang} set={setLang} opts={['Urdu','English']} />} />
                <Divider />
                <Row Icon={I.Bell}   color="coral"  title="Practice reminders"   sub="Daily nudge at 7:00 PM"    control={<Toggle on={reminders} onClick={() => setReminders(v => !v)} />} />
              </Section>

              <Section title="Accessibility">
                <Row Icon={I.Sun}    color="amber"  title="Theme"          sub="Toggle light / dark"       control={<LsThemeToggle />} />
                <Divider />
                <Row Icon={I.Search} color="green"  title="Larger text"    sub="Increase caption size"     control={<Toggle on={bigText}      onClick={() => setBigText(v => !v)} />} />
                <Divider />
                <Row Icon={I.Star}   color="violet" title="High contrast"   sub="Boost readability"         control={<Toggle on={highContrast} onClick={() => setHighContrast(v => !v)} />} />
              </Section>

              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-faint)', padding: 8 }}>LinguaSign v1.0 · Pakistan Sign Language</p>
            </div>

          </div>
        </div>
      </div>
    </AppShell>
  );
}
