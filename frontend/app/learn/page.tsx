/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { AppShell, TopBar, Eyebrow } from '../components/ls/Components';
import * as I from '../components/ls/Icons';

// Real PSL data – 5 words the model actually recognises
const WORDS_QUIZ = [
  { image: '/images/words/1.png', ur: 'السلام علیکم', opts: ['السلام علیکم', 'اللہ حافظ', 'باپ', 'ماں'] },
  { image: '/images/words/2.png', ur: 'اللہ حافظ',    opts: ['میں', 'باپ', 'اللہ حافظ', 'السلام علیکم'] },
  { image: '/images/words/3.png', ur: 'باپ',           opts: ['ماں', 'باپ', 'میں', 'اللہ حافظ'] },
  { image: '/images/words/4.png', ur: 'ماں',           opts: ['باپ', 'السلام علیکم', 'میں', 'ماں'] },
  { image: '/images/words/5.png', ur: 'میں',           opts: ['اللہ حافظ', 'میں', 'باپ', 'ماں'] },
];

// All 37 PSL letters in order (matches model labels)
const ALPHA_SIGNS = [
  { ur: 'ء', img: '/images/alphabet/1.png'  },
  { ur: 'ا', img: '/images/alphabet/2.png'  },
  { ur: 'ب', img: '/images/alphabet/3.png'  },
  { ur: 'پ', img: '/images/alphabet/28.png' },
  { ur: 'ت', img: '/images/alphabet/4.png'  },
  { ur: 'ٹ', img: '/images/alphabet/27.png' },
  { ur: 'ث', img: '/images/alphabet/5.png'  },
  { ur: 'ج', img: '/images/alphabet/6.png'  },
  { ur: 'چ', img: '/images/alphabet/29.png' },
  { ur: 'ح', img: '/images/alphabet/7.png'  },
  { ur: 'خ', img: '/images/alphabet/8.png'  },
  { ur: 'د', img: '/images/alphabet/9.png'  },
  { ur: 'ڈ', img: '/images/alphabet/30.png' },
  { ur: 'ذ', img: '/images/alphabet/10.png' },
  { ur: 'ر', img: '/images/alphabet/11.png' },
  { ur: 'ز', img: '/images/alphabet/12.png' },
  { ur: 'ژ', img: '/images/alphabet/31.png' },
  { ur: 'س', img: '/images/alphabet/13.png' },
  { ur: 'ش', img: '/images/alphabet/14.png' },
  { ur: 'ص', img: '/images/alphabet/15.png' },
  { ur: 'ض', img: '/images/alphabet/16.png' },
  { ur: 'ط', img: '/images/alphabet/17.png' },
  { ur: 'ظ', img: '/images/alphabet/18.png' },
  { ur: 'ع', img: '/images/alphabet/19.png' },
  { ur: 'غ', img: '/images/alphabet/20.png' },
  { ur: 'ف', img: '/images/alphabet/21.png' },
  { ur: 'ق', img: '/images/alphabet/22.png' },
  { ur: 'ک', img: '/images/alphabet/32.png' },
  { ur: 'گ', img: '/images/alphabet/33.png' },
  { ur: 'ل', img: '/images/alphabet/23.png' },
  { ur: 'م', img: '/images/alphabet/24.png' },
  { ur: 'ن', img: '/images/alphabet/25.png' },
  { ur: 'ں', img: '/images/alphabet/34.png' },
  { ur: 'و', img: '/images/alphabet/26.png' },
  { ur: 'ھ', img: '/images/alphabet/35.png' },
  { ur: 'ی', img: '/images/alphabet/36.png' },
  { ur: 'ے', img: '/images/alphabet/37.png' },
];

const COLORS5 = ['green', 'coral', 'violet', 'sky', 'amber'];

const LESSONS = [
  { title: 'The PSL Alphabet', sub: '37 letters', color: 'green',  Icon: I.Hand, href: '/live-learn' },
  { title: 'PSL Words',        sub: '5 words',    color: 'violet', Icon: I.Wave, href: '/live-learn' },
];

// AlphaCard – shows letter; hover reveals its sign image
function AlphaCard({ sign, color }: { sign: typeof ALPHA_SIGNS[0]; color: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href="/live-learn"
      style={{ aspectRatio: '1', borderRadius: 16, background: hovered ? `var(--${color}-soft)` : 'var(--surface-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'all 0.2s', border: '1px solid var(--line)', textDecoration: 'none', overflow: 'hidden', position: 'relative', transform: hovered ? 'translateY(-2px)' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {hovered ? (
        <img src={sign.img} alt={sign.ur} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, borderRadius: 16 }} />
      ) : (
        <>
          <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 26, color: 'var(--ink)', lineHeight: 1, paddingBottom: 6 }}>{sign.ur}</span>
          <I.Hand size={15} sw={1.7} />
        </>
      )}
    </Link>
  );
}

function Quiz() {
  const [q, setQ] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const item = WORDS_QUIZ[q];
  const answered = picked !== null;

  function pick(opt: string) {
    if (answered) return;
    setPicked(opt);
    if (opt === item.ur) setScore(s => s + 1);
  }
  function next() { setPicked(null); setQ(v => (v + 1) % WORDS_QUIZ.length); }

  return (
    <div className="card" style={{ padding: 26 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <Eyebrow icon={I.Target} color="coral">Quick quiz</Eyebrow>
        <span className="chip" style={{ background: 'var(--amber-soft)', color: 'var(--ink)' }}>
          <I.Star size={14} /> Score {score}/{WORDS_QUIZ.length}
        </span>
      </div>
      <h3 style={{ fontSize: 22, marginBottom: 6 }}>What does this sign mean?</h3>
      <p style={{ color: 'var(--ink-faint)', fontSize: 14, marginBottom: 18 }}>Question {q + 1} of {WORDS_QUIZ.length}</p>

      <div style={{ borderRadius: 22, overflow: 'hidden', marginBottom: 20, background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
        <img src={item.image} alt="PSL sign" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {item.opts.map((opt, k) => {
          let bg = 'var(--surface-2)', col = 'var(--ink)', bd = 'transparent';
          if (answered) {
            if (opt === item.ur)               { bg = 'var(--green-soft)'; col = 'var(--primary-ink)'; bd = 'var(--primary)'; }
            else if (opt === picked)           { bg = 'var(--coral-soft)'; col = 'var(--ink)'; bd = 'var(--coral)'; }
          }
          return (
            <button key={k} onClick={() => pick(opt)}
              style={{ padding: '15px 16px', borderRadius: 16, fontFamily: 'var(--font-urdu)', fontWeight: 600, fontSize: 18, background: bg, color: col, border: `2px solid ${bd}`, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', direction: 'rtl' }}>
              {opt}
              {answered && opt === item.ur    && <I.Check size={20} sw={3} />}
              {answered && opt === picked && opt !== item.ur && <I.X size={20} sw={3} />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="fade-up" style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontWeight: 600, color: picked === item.ur ? 'var(--green-deep)' : 'var(--ink-soft)' }}>
            {picked === item.ur ? '🎉 Correct! Well done.' : `Correct answer: ${item.ur}`}
          </span>
          <button className="btn btn-primary btn-sm" onClick={next}>Next <I.ArrowRight size={17} /></button>
        </div>
      )}
    </div>
  );
}

function LessonCard({ l }: { l: typeof LESSONS[0] }) {
  const { Icon } = l;
  return (
    <Link href={l.href} style={{ textDecoration: 'none' }}>
      <div style={{ textAlign: 'left', padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--surface)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'all 0.2s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: `var(--${l.color}-soft)`, color: `var(--${l.color})`, display: 'grid', placeItems: 'center' }}>
            <Icon size={26} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: `var(--${l.color})` }}>Practice</span>
        </div>
        <h3 style={{ fontSize: 19, marginBottom: 4 }}>{l.title}</h3>
        <p style={{ color: 'var(--ink-faint)', fontSize: 14 }}>{l.sub}</p>
      </div>
    </Link>
  );
}

export default function LearnPage() {
  return (
    <AppShell>
      <div className="ls-page">
        <TopBar title="Learn PSL" sub="Bite-sized lessons, quizzes and practice" titleHref="/" />
        <div style={{ padding: 'clamp(20px,3vw,34px)', display: 'flex', flexDirection: 'column', gap: 26, maxWidth: 1200 }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 22 }}>Your learning path</h2>
              <span className="chip" style={{ background: 'var(--violet-soft)', color: 'var(--violet)' }}>37 letters · 5 words</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
              {LESSONS.map((l, k) => <LessonCard key={k} l={l} />)}
            </div>
          </div>

          <div className="ls-learn-bottom">
            <div className="card" style={{ padding: 26 }}>
              <Eyebrow icon={I.Hand} color="green">Alphabet practice</Eyebrow>
              <h3 style={{ fontSize: 22, margin: '14px 0 4px' }}>All 37 PSL letters</h3>
              <p style={{ color: 'var(--ink-faint)', fontSize: 14, marginBottom: 18 }}>Hover a letter to see its sign · tap to practise live</p>
              <div className="ls-alpha-grid">
                {ALPHA_SIGNS.map((sign, k) => (
                  <AlphaCard key={k} sign={sign} color={COLORS5[k % 5]} />
                ))}
              </div>
            </div>
            <Quiz />
          </div>

        </div>
      </div>
    </AppShell>
  );
}
