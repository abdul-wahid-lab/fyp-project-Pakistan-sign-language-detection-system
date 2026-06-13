/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from 'react';
import Image from 'next/image';
import { LsPublicNav, LsFooter } from '../components/ls/Components';

const LABELS: string[] = [
  'ء','ا','ب','ت','ث','ج','ح','خ','د','ذ',
  'ر','ز','س','ش','ص','ض','ط','ظ','ع','غ',
  'ف','ق','ل','م','ن','و','ٹ','پ','چ','ڈ',
  'ژ','ک','گ','ں','ھ','ی','ے',
];
const ALPHA_SIGNS = LABELS.map((label, i) => ({ label, index: i + 1 }));

const WORDS: { urdu: string; english: string; label: string; index: number }[] = [
  { urdu: 'السلام علیکم', english: 'Hello / Peace',  label: 'السلام علیکم', index: 1 },
  { urdu: 'اللہ حافظ',   english: 'Goodbye',         label: 'اللہ حافظ',   index: 2 },
  { urdu: 'باپ',          english: 'Father',           label: 'باپ',          index: 3 },
  { urdu: 'ماں',          english: 'Mother',           label: 'ماں',          index: 4 },
  { urdu: 'میں',          english: 'I / Me',           label: 'میں',          index: 5 },
];

type CategoryId = 'alphabet' | 'words' | 'greetings' | 'numbers' | 'colors' | 'family' | 'phrases' | 'animals' | 'food';
type View = 'home' | CategoryId;

interface Category { id: CategoryId; title: string; subtitle: string; count: number; ready: boolean; icon: React.ReactNode; color: string; }

const CATEGORIES: Category[] = [
  {
    id: 'alphabet', title: 'Urdu Alphabet', subtitle: '37 letters', count: 37, ready: true, color: 'green',
    icon: <span style={{ fontSize: 44, fontWeight: 800, color: 'var(--primary)', direction: 'rtl', lineHeight: 1 }}>ا</span>,
  },
  {
    id: 'words', title: 'Words', subtitle: '5 signs', count: 5, ready: true, color: 'violet',
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="var(--violet)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 8h32a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H16l-8 8V10a2 2 0 0 1 2-2z"/>
        <line x1="16" y1="20" x2="32" y2="20"/><line x1="16" y1="28" x2="24" y2="28"/>
      </svg>
    ),
  },
  {
    id: 'greetings', title: 'Greetings', subtitle: 'Common phrases', count: 0, ready: false, color: 'sky',
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="var(--ink-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4z"/>
        <path d="M16 28s2 4 8 4 8-4 8-4"/><line x1="18" y1="20" x2="18.01" y2="20"/><line x1="30" y1="20" x2="30.01" y2="20"/>
      </svg>
    ),
  },
  {
    id: 'numbers', title: 'Numbers', subtitle: '0 – 100', count: 0, ready: false, color: 'amber',
    icon: <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--ink-faint)', letterSpacing: '-0.04em', lineHeight: 1 }}>123</span>,
  },
  {
    id: 'colors', title: 'Colors', subtitle: 'Basic colors', count: 0, ready: false, color: 'coral',
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <circle cx="17" cy="19" r="9" fill="none" stroke="var(--ink-faint)" strokeWidth="1.8"/>
        <circle cx="31" cy="19" r="9" fill="none" stroke="var(--ink-faint)" strokeWidth="1.8"/>
        <circle cx="24" cy="31" r="9" fill="none" stroke="var(--ink-faint)" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    id: 'family', title: 'Family', subtitle: 'Relations', count: 0, ready: false, color: 'sky',
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="var(--ink-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="14" r="5"/><circle cx="32" cy="14" r="5"/>
        <path d="M6 36c0-6 4.5-10 10-10s10 4 10 10"/><path d="M22 36c0-6 4.5-10 10-10s10 4 10 10"/>
      </svg>
    ),
  },
  {
    id: 'phrases', title: 'Common Phrases', subtitle: 'Everyday use', count: 0, ready: false, color: 'violet',
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="var(--ink-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="40" height="28" rx="3"/><line x1="14" y1="20" x2="34" y2="20"/><line x1="14" y1="28" x2="26" y2="28"/>
      </svg>
    ),
  },
  {
    id: 'animals', title: 'Animals', subtitle: 'Common animals', count: 0, ready: false, color: 'green',
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="var(--ink-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="24" cy="28" rx="12" ry="10"/>
        <ellipse cx="14" cy="16" rx="5" ry="7"/><ellipse cx="34" cy="16" rx="5" ry="7"/>
        <line x1="18" y1="38" x2="16" y2="44"/><line x1="30" y1="38" x2="32" y2="44"/>
      </svg>
    ),
  },
  {
    id: 'food', title: 'Food & Drink', subtitle: 'Daily items', count: 0, ready: false, color: 'amber',
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="var(--ink-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12v8a16 16 0 0 0 32 0v-8"/><line x1="24" y1="36" x2="24" y2="44"/>
        <line x1="16" y1="44" x2="32" y2="44"/><line x1="8" y1="12" x2="40" y2="12"/>
      </svg>
    ),
  },
];

function BackCrumb({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: 'var(--ink-soft)', fontFamily: 'var(--font-display)', fontWeight: 600, transition: 'color 0.2s' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--ink)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--ink-soft)'}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Dictionary
      </button>
      <span style={{ color: 'var(--ink-faint)', fontSize: 13 }}>/</span>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>{label}</span>
    </div>
  );
}

export default function DictionaryPage() {
  const [view, setView] = useState<View>('home');
  const [query, setQuery] = useState('');
  const [selectedAlpha, setSelectedAlpha] = useState<{ label: string; index: number } | null>(null);
  const [selectedWord, setSelectedWord] = useState<typeof WORDS[number] | null>(null);

  const activeCategory = CATEGORIES.find(c => c.id === view);
  const filteredAlpha = query.trim() ? ALPHA_SIGNS.filter(s => s.label.includes(query.trim())) : ALPHA_SIGNS;
  const filteredWords = query.trim() ? WORDS.filter(w => w.urdu.includes(query.trim()) || w.english.toLowerCase().includes(query.toLowerCase().trim())) : WORDS;

  function goHome() { setView('home'); setQuery(''); setSelectedAlpha(null); setSelectedWord(null); }

  function SearchInput({ placeholder }: { placeholder: string }) {
    return (
      <div style={{ position: 'relative' }}>
        <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={placeholder}
          style={{ background: 'var(--surface-2)', border: '1.5px solid var(--line)', borderRadius: 'var(--radius)', padding: '8px 32px 8px 32px', fontSize: 14.5, color: 'var(--ink)', outline: 'none', fontFamily: 'inherit', direction: view === 'alphabet' ? 'rtl' : 'ltr', width: 220, transition: 'border-color 0.2s' }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--line)')}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: 2, lineHeight: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>
    );
  }

  const cardHover = (e: React.MouseEvent<HTMLDivElement>, enter: boolean) => {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = enter ? 'var(--primary)' : 'var(--line)';
    el.style.transform = enter ? 'translateY(-3px)' : 'none';
    el.style.boxShadow = enter ? 'var(--shadow)' : 'var(--shadow-sm)';
  };

  return (
    <div className="ls-scope" style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflow: 'hidden' }}>
      <LsPublicNav active="/dictionary" />

      {/* ── HOME ── */}
      {view === 'home' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px clamp(20px,4vw,52px)' }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 'clamp(20px,2.4vw,32px)', margin: 0 }}>PSL Dictionary</h1>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 6 }}>Explore Pakistan Sign Language — alphabet and word categories</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {CATEGORIES.map(cat => (
              <div key={cat.id} onClick={() => cat.ready && setView(cat.id)}
                className="card"
                style={{ padding: '26px 18px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, cursor: cat.ready ? 'pointer' : 'default', opacity: cat.ready ? 1 : 0.48, transition: 'all 0.2s', position: 'relative' }}
                onMouseEnter={e => { if (cat.ready) cardHover(e, true); }}
                onMouseLeave={e => { if (cat.ready) cardHover(e, false); }}
              >
                {!cat.ready && (
                  <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 700, color: 'var(--ink-faint)', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 999, padding: '2px 8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Soon</span>
                )}
                <div style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cat.icon}</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14.5, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{cat.title}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{cat.ready ? `${cat.count} signs` : cat.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ALPHABET ── */}
      {view === 'alphabet' && (
        <>
          <div style={{ padding: '18px clamp(20px,4vw,52px) 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <BackCrumb label="Urdu Alphabet" onBack={goHome} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{filteredAlpha.length} of {ALPHA_SIGNS.length}</span>
                <SearchInput placeholder="Search e.g. ب" />
              </div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px clamp(20px,4vw,52px) 24px' }}>
            {filteredAlpha.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--ink-faint)', gap: 8 }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <span style={{ fontSize: 14 }}>No sign found for &ldquo;{query}&rdquo;</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))', gap: 14 }}>
                {filteredAlpha.map(({ label, index }) => (
                  <div key={index} onClick={() => setSelectedAlpha({ label, index })}
                    className="card"
                    style={{ padding: '14px 10px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}
                    onMouseEnter={e => cardHover(e, true)}
                    onMouseLeave={e => cardHover(e, false)}
                  >
                    <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--ink)', direction: 'rtl', lineHeight: 1 }}>{label}</span>
                    <Image src={`/images/alphabet/${index}.png`} alt={`Sign for ${label}`} width={88} height={88} style={{ objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── WORDS ── */}
      {view === 'words' && (
        <>
          <div style={{ padding: '18px clamp(20px,4vw,52px) 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <BackCrumb label="Words" onBack={goHome} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{filteredWords.length} of {WORDS.length}</span>
                <SearchInput placeholder="Search word…" />
              </div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px clamp(20px,4vw,52px) 24px' }}>
            {filteredWords.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--ink-faint)', gap: 8 }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <span style={{ fontSize: 14 }}>No word found for &ldquo;{query}&rdquo;</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(158px, 1fr))', gap: 14 }}>
                {filteredWords.map(word => (
                  <div key={word.label} onClick={() => setSelectedWord(word)}
                    className="card"
                    style={{ padding: '14px 10px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}
                    onMouseEnter={e => cardHover(e, true)}
                    onMouseLeave={e => cardHover(e, false)}
                  >
                    <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', direction: 'rtl', lineHeight: 1.2 }}>{word.urdu}</span>
                    <Image src={`/images/words/${word.index}.png`} alt={`Sign for ${word.urdu}`} width={88} height={88} style={{ objectFit: 'contain' }} />
                    <span style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{word.english}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── COMING SOON ── */}
      {view !== 'home' && view !== 'alphabet' && view !== 'words' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 48, position: 'relative' }}>
          <button onClick={goHome} style={{ position: 'absolute', top: 24, left: 'clamp(20px,4vw,52px)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: 'var(--ink-soft)', fontFamily: 'var(--font-display)', fontWeight: 600, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--ink)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--ink-soft)'}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Dictionary
          </button>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {activeCategory?.icon}
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, margin: '0 0 8px' }}>{activeCategory?.title}</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', maxWidth: 320, lineHeight: 1.6 }}>
              Sign images for <strong style={{ color: 'var(--ink)' }}>{activeCategory?.title}</strong> will be added in the next update.
            </p>
          </div>
          <button className="btn btn-primary" onClick={goHome}>Back to Dictionary</button>
        </div>
      )}

      <LsFooter />

      {/* ── ALPHABET MODAL ── */}
      {selectedAlpha && (
        <div onClick={() => setSelectedAlpha(null)} style={{ position: 'fixed', inset: 0, background: 'oklch(0 0 0 / 0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} className="card" style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, position: 'relative', minWidth: 280 }}>
            <button onClick={() => setSelectedAlpha(null)} style={{ position: 'absolute', top: 14, right: 14, padding: 4, lineHeight: 0, color: 'var(--ink-faint)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <span style={{ fontSize: 72, fontWeight: 800, color: 'var(--ink)', direction: 'rtl', lineHeight: 1 }}>{selectedAlpha.label}</span>
            <Image src={`/images/alphabet/${selectedAlpha.index}.png`} alt={`Sign for ${selectedAlpha.label}`} width={220} height={220} style={{ objectFit: 'contain' }} />
            <span style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>Sign {selectedAlpha.index} of {ALPHA_SIGNS.length}</span>
          </div>
        </div>
      )}

      {/* ── WORD MODAL ── */}
      {selectedWord && (
        <div onClick={() => setSelectedWord(null)} style={{ position: 'fixed', inset: 0, background: 'oklch(0 0 0 / 0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} className="card" style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, position: 'relative', minWidth: 280 }}>
            <button onClick={() => setSelectedWord(null)} style={{ position: 'absolute', top: 14, right: 14, padding: 4, lineHeight: 0, color: 'var(--ink-faint)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <span style={{ fontSize: 52, fontWeight: 800, color: 'var(--ink)', direction: 'rtl', lineHeight: 1.2 }}>{selectedWord.urdu}</span>
            <Image src={`/images/words/${selectedWord.index}.png`} alt={`Sign for ${selectedWord.urdu}`} width={220} height={220} style={{ objectFit: 'contain' }} />
            <span style={{ fontSize: 14, color: 'var(--ink-soft)', fontWeight: 500 }}>{selectedWord.english}</span>
          </div>
        </div>
      )}
    </div>
  );
}
