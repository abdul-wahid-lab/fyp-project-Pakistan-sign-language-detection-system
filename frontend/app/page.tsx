"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LsPublicNav, HandSkeleton, Eyebrow, LsFooter } from './components/ls/Components';
import * as I from './components/ls/Icons';

const COLORS = ['var(--coral)','var(--violet)','var(--sky)','var(--amber)','var(--green)'];
const ALPHA_COLORS = ['green','coral','violet','sky','amber'] as const;
const ALPHA_GRADS = [
  'linear-gradient(160deg, oklch(0.74 0.13 232), oklch(0.62 0.16 292))',
  'linear-gradient(160deg, oklch(0.74 0.15 158), oklch(0.6 0.14 200))',
  'linear-gradient(160deg, oklch(0.74 0.16 32),  oklch(0.66 0.16 358))',
  'linear-gradient(160deg, oklch(0.7  0.16 292), oklch(0.64 0.15 330))',
  'linear-gradient(160deg, oklch(0.8  0.14 80),  oklch(0.72 0.16 44))',
];
const ALPHA_AURA = [
  'oklch(0.68 0.15 252)',
  'oklch(0.68 0.16 175)',
  'oklch(0.70 0.16 18)',
  'oklch(0.66 0.18 305)',
  'oklch(0.74 0.15 65)',
];

const PSL = [
  { c:'ء', n:'Hamza',       u:'ہمزہ'       }, { c:'ا', n:'Alif',        u:'الف'        },
  { c:'ب', n:'Be',          u:'بے'         }, { c:'پ', n:'Pe',           u:'پے'         },
  { c:'ت', n:'Te',          u:'تے'         }, { c:'ٹ', n:'Ṭe',           u:'ٹے'         },
  { c:'ث', n:'Se',          u:'ثے'         }, { c:'ج', n:'Jeem',         u:'جیم'        },
  { c:'چ', n:'Che',         u:'چے'         }, { c:'ح', n:'Baṛī He',      u:'بڑی حے'     },
  { c:'خ', n:'Khe',         u:'خے'         }, { c:'د', n:'Dal',          u:'دال'        },
  { c:'ڈ', n:'Ḍal',         u:'ڈال'        }, { c:'ذ', n:'Zal',          u:'ذال'        },
  { c:'ر', n:'Re',          u:'رے'         }, { c:'ز', n:'Ze',           u:'زے'         },
  { c:'ژ', n:'Zhe',         u:'ژے'         }, { c:'س', n:'Seen',         u:'سین'        },
  { c:'ش', n:'Sheen',       u:'شین'        }, { c:'ص', n:'Suad',         u:'صواد'       },
  { c:'ض', n:'Zuad',        u:'ضواد'       }, { c:'ط', n:'Toe',          u:'طوے'        },
  { c:'ظ', n:'Zoe',         u:'ظوے'        }, { c:'ع', n:'Ain',          u:'عین'        },
  { c:'غ', n:'Ghain',       u:'غین'        }, { c:'ف', n:'Fe',           u:'فے'         },
  { c:'ق', n:'Qaf',         u:'قاف'        }, { c:'ک', n:'Kaf',          u:'کاف'        },
  { c:'گ', n:'Gaf',         u:'گاف'        }, { c:'ل', n:'Lam',          u:'لام'        },
  { c:'م', n:'Meem',        u:'میم'        }, { c:'ن', n:'Noon',         u:'نون'        },
  { c:'ں', n:'Noon Ghunna', u:'نون غنہ'    }, { c:'و', n:'Wao',          u:'واؤ'        },
  { c:'ھ', n:'Choṭī He',    u:'چھوٹی ہے'   }, { c:'ی', n:'Ye',           u:'یے'         },
  { c:'ے', n:'Baṛī Ye',     u:'بڑی یے'    },
];

// ── Left-gutter hero decoration ────────────────────────────
function HeroDecor() {
  const chips = [
    { c:'ا', col:'var(--coral)',  top:'11%', left:'34%', s:50, d:'0s'   },
    { c:'ج', col:'var(--violet)', top:'45%', left:'6%',  s:44, d:'0.9s' },
    { c:'م', col:'var(--sky)',    top:'76%', left:'38%', s:48, d:'1.5s' },
  ];
  return (
    <div className="ls-hero-decor" aria-hidden="true">
      <svg className="ls-decor-path" viewBox="0 0 120 460" preserveAspectRatio="none">
        <path className="march" d="M60 8 C18 92 104 150 56 232 C16 308 100 364 60 452" fill="none" stroke="var(--ink-faint)" strokeWidth={2} strokeDasharray="2 13" strokeLinecap="round" opacity={0.35} />
        <path className="flow"  d="M60 8 C18 92 104 150 56 232 C16 308 100 364 60 452" fill="none" stroke="var(--green)" strokeWidth={3.4} strokeDasharray="26 614" strokeLinecap="round" />
      </svg>
      <div className="ls-decor-hand" style={{ top:'29%', left:'52%' }}>
        <span className="ls-radar" />
        <span className="ls-radar" style={{ animationDelay:'1.3s' }} />
        <I.Hand size={26} sw={1.9} />
      </div>
      {chips.map((ch, k) => (
        <div key={k} className="ls-decor-chip" style={{ top:ch.top, left:ch.left, width:ch.s, height:ch.s, fontSize:ch.s*0.5, color:ch.col, animationDelay:ch.d }}>
          {ch.c}
        </div>
      ))}
      <div className="ls-twinkle" style={{ top:'23%', left:'72%', color:'var(--amber)' }}><I.Sparkle size={18} /></div>
      <div className="ls-twinkle" style={{ top:'63%', left:'20%', color:'var(--green)', animationDelay:'1.2s' }}><I.Sparkle size={14} /></div>
      <div className="ls-twinkle" style={{ top:'88%', left:'64%', color:'var(--coral)', animationDelay:'0.6s' }}><I.Star size={15} /></div>
    </div>
  );
}

// ── Interactive alphabet explorer ───────────────────────────
function AlphabetExplorer() {
  const [sel, setSel] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setSel(s => (s + 1) % PSL.length), 2400);
    return () => clearInterval(t);
  }, [auto]);

  const pick = (i: number) => { setSel(i); setAuto(false); };
  const item = PSL[sel];
  const grad = ALPHA_GRADS[sel % ALPHA_GRADS.length];
  const aura = ALPHA_AURA[sel % ALPHA_AURA.length];

  return (
    <div style={{ position:'relative' }}>
      {/* color bleed from card into text section */}
      <div style={{
        position:'absolute', inset:0, zIndex:0, pointerEvents:'none',
        background:`radial-gradient(ellipse 65% 80% at 22% 50%, ${aura} 0%, transparent 70%)`,
        opacity:0.18, filter:'blur(36px)',
        transition:'background 0.7s ease',
      }} />
    <div className="ls-alpha-explorer" style={{ position:'relative', zIndex:1 }}>
      <div className="ls-alpha-preview" style={{ background: grad }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(120% 80% at 50% 8%, transparent 55%, oklch(0.2 0.04 290/0.4))' }} />
        <span key={'b'+sel} className="pop" style={{ position:'absolute', top:14, left:16, display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:999, background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', color:'white', fontSize:12, fontWeight:700, fontFamily:'var(--font-display)' }}>
          <span style={{ width:7, height:7, borderRadius:9, background:'white', animation:'nodePulse 1.2s infinite' }} /> Tracking
        </span>
        <span key={'l'+sel} className="pop" style={{ position:'absolute', top:12, right:18, fontFamily:'var(--font-urdu)', fontSize:44, color:'white', fontWeight:700, lineHeight:1, paddingBottom:10 }}>{item.c}</span>
        <div key={'s'+sel} style={{
          position:'absolute', left:'8%', right:'8%', top:'18%', bottom:'26%',
          animation:`handIn${sel % 6} 0.55s cubic-bezier(0.34,1.56,0.64,1) both`,
        }}>
          <HandSkeleton color="white" accent="oklch(0.85 0.18 100)" />
        </div>
        <div style={{ position:'absolute', left:14, right:14, bottom:16 }}>
          <div key={'c'+sel} className="pop" style={{ background:'var(--surface)', borderRadius:18, padding:'12px 16px 16px', boxShadow:'var(--shadow)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <div>
              <div style={{ fontFamily:'var(--font-urdu)', fontSize:20, fontWeight:700, color:'var(--ink)', lineHeight:1.6 }}>{item.u}</div>
            </div>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:13, color:'var(--ink-faint)' }}>{sel+1} / {PSL.length}</span>
          </div>
        </div>
      </div>

      <div style={{ textAlign:'left' }}>
        <p style={{ color:'var(--ink-soft)', fontSize:16, marginBottom:18, maxWidth:440 }}>
          All 37 letters of the Urdu alphabet, each with its own PSL handshape.{' '}
          <span style={{ color:'var(--ink-faint)' }}>Tap any letter to preview its sign — it plays on its own until you do.</span>
        </p>
        <div className="ls-alpha-keys">
          {PSL.map((p, k) => {
            const on = k === sel;
            const c  = ALPHA_COLORS[k % 5];
            return (
              <button key={k} onClick={() => pick(k)} onMouseEnter={() => pick(k)} aria-label={p.n}
                style={{ aspectRatio:'1', borderRadius:15, display:'grid', placeItems:'center',
                  fontFamily:'var(--font-urdu)', fontWeight:700, lineHeight:1, paddingBottom:7,
                  fontSize: on?30:25, color: on?'white':`var(--${c})`,
                  background: on?`var(--${c})`:'var(--surface)',
                  border:`1.5px solid ${on?'transparent':'var(--line)'}`,
                  boxShadow: on?'var(--shadow)':'var(--shadow-sm)',
                  transform: on?'translateY(-3px) scale(1.04)':'none',
                  transition:'all 0.22s var(--ease)', cursor:'pointer' }}>
                {p.c}
              </button>
            );
          })}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:22, flexWrap:'wrap' }}>
          <Link href="/sign"       className="btn btn-primary"><I.Camera size={18} /> Practise in camera</Link>
          <Link href="/live-learn" className="btn btn-soft"><I.Book size={18} /> Open lessons</Link>
          {auto && (
            <span style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:13.5, fontWeight:600, color:'var(--ink-faint)' }}>
              <span style={{ width:8, height:8, borderRadius:9, background:'var(--green)', animation:'nodePulse 1.1s infinite' }} /> Auto-playing
            </span>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

// ── Hero demo card ──────────────────────────────────────────
function HeroDemo() {
  const words = [
    { ur:'السلام علیکم', en:'Hello',     tl:'As-salaam alaikum' },
    { ur:'شکریہ',        en:'Thank you', tl:'Shukriya'          },
    { ur:'محبت',         en:'Love',      tl:'Mohabbat'          },
    { ur:'دوست',         en:'Friend',    tl:'Dost'              },
  ];
  const CHIPS = ['ا','ب','پ','ت','ج'];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(v => (v+1) % words.length), 2600);
    return () => clearInterval(t);
  }, []);
  const w = words[i];
  const pill = (bg: string): React.CSSProperties => ({
    display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px',
    borderRadius:999, background:bg, color:'white', fontSize:12, fontWeight:700,
    fontFamily:'var(--font-display)', backdropFilter:'blur(8px)',
  });
  return (
    <div style={{ position:'relative' }}>
      {CHIPS.map((c, k) => (
        <div key={k} className="floaty" style={{ position:'absolute', zIndex:3, fontFamily:'var(--font-urdu)', fontSize:22,
          width:46, height:46, display:'grid', placeItems:'center', borderRadius:14,
          background:'var(--surface)', color:COLORS[k], boxShadow:'var(--shadow)', fontWeight:700,
          top:['8%','64%','30%','80%','-4%'][k], left:['-7%','-9%','102%','88%','70%'][k],
          animationDelay:`${k*0.7}s` }}>{c}</div>
      ))}
      <div style={{ position:'relative', borderRadius:32, overflow:'hidden', aspectRatio:'4/5', maxWidth:380, margin:'0 auto',
        background:'linear-gradient(160deg,oklch(0.78 0.13 232),oklch(0.66 0.16 292))',
        boxShadow:'var(--shadow-lg)', border:'6px solid var(--surface)' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(120% 80% at 50% 10%,transparent,oklch(0.2 0.04 280/0.45))' }} />
        <div style={{ position:'absolute', inset:'14% 22% 26%', opacity:0.95 }}>
          <HandSkeleton color="white" accent="oklch(0.85 0.18 100)" />
        </div>
        <div style={{ position:'absolute', top:16, left:16, right:16, display:'flex', justifyContent:'space-between' }}>
          <span style={pill('oklch(0.72 0.18 25)')}>
            <span style={{ width:7, height:7, borderRadius:9, background:'white', animation:'nodePulse 1.2s infinite', display:'inline-block' }} /> LIVE
          </span>
          <span style={pill('oklch(0.2 0.04 280/0.5)')}>98% match</span>
        </div>
        <div key={i} className="pop" style={{ position:'absolute', bottom:20, left:16, right:16 }}>
          <div style={{ background:'var(--surface)', borderRadius:20, padding:'14px 18px', boxShadow:'var(--shadow)', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontFamily:'var(--font-urdu)', fontSize:26, color:'var(--ink)', lineHeight:1, paddingBottom:6 }}>{w.ur}</div>
            <div style={{ flex:1, textAlign:'right' }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:18, color:'var(--ink)' }}>{w.en}</div>
              <div style={{ fontSize:12, color:'var(--ink-faint)' }}>{w.tl}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ n, Icon, color, title, body }: { n:string; Icon:React.FC<I.IconProps>; color:string; title:string; body:string }) {
  return (
    <div className="card" style={{ padding:28, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-18, right:-8, fontFamily:'var(--font-display)', fontWeight:700, fontSize:110, color:`var(--${color}-soft)`, lineHeight:1 }}>{n}</div>
      <div style={{ width:56, height:56, borderRadius:18, background:`var(--${color}-soft)`, color:`var(--${color})`, display:'grid', placeItems:'center', marginBottom:18, position:'relative' }}>
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize:22, marginBottom:8, position:'relative' }}>{title}</h3>
      <p style={{ color:'var(--ink-soft)', fontSize:15.5, position:'relative' }}>{body}</p>
    </div>
  );
}

function Feature({ Icon, color, title, body }: { Icon:React.FC<I.IconProps>; color:string; title:string; body:string }) {
  return (
    <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
      <div style={{ width:48, height:48, flexShrink:0, borderRadius:14, background:`var(--${color}-soft)`, color:`var(--${color})`, display:'grid', placeItems:'center' }}>
        <Icon size={24} />
      </div>
      <div>
        <h4 style={{ fontSize:18, marginBottom:5 }}>{title}</h4>
        <p style={{ color:'var(--ink-soft)', fontSize:14.5 }}>{body}</p>
      </div>
    </div>
  );
}

function AudienceCard({ color, label, title, body }: { color:string; label:string; title:string; body:string }) {
  return (
    <div style={{ padding:26, borderRadius:'var(--radius-lg)', background:`var(--${color}-soft)`, border:'1px solid var(--line)' }}>
      <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, color:`var(--${color})`, marginBottom:10, letterSpacing:'0.04em', textTransform:'uppercase' }}>{label}</div>
      <h4 style={{ fontSize:21, marginBottom:8 }}>{title}</h4>
      <p style={{ color:'var(--ink-soft)', fontSize:15 }}>{body}</p>
    </div>
  );
}

const sec: React.CSSProperties = { padding:'clamp(40px,6vw,80px) clamp(18px,5vw,64px)', maxWidth:1240, margin:'0 auto' };

export default function LandingPage() {
  return (
    <div className="ls-scope" style={{ minHeight:'100vh', background:'var(--bg)', overflowX:'hidden' }}>

      {/* NAV */}
      <LsPublicNav />

      {/* HERO */}
      <section style={{ position:'relative', overflow:'hidden', background:'radial-gradient(ellipse 80% 65% at 10% 35%, oklch(0.74 0.16 158 / 0.09) 0%, transparent 65%), radial-gradient(ellipse 65% 55% at 88% 72%, oklch(0.66 0.16 292 / 0.07) 0%, transparent 60%)' }}>
        <HeroDecor />
        <div style={{ padding:'clamp(40px,7vw,90px) clamp(18px,5vw,64px) 60px', maxWidth:1240, margin:'0 auto', position:'relative', zIndex:2 }}>
          <div className="ls-hero-grid">
            <div className="fade-up">
              <Eyebrow icon={I.Sparkle} color="green">Pakistan Sign Language · powered by AI</Eyebrow>
              <h1 style={{ fontSize:'clamp(40px,6vw,68px)', margin:'22px 0 0', lineHeight:1.02 }}>
                Sign it.{' '}<span style={{ color:'var(--primary)' }}>See it</span>{' '}translated,{' '}
                <span style={{ position:'relative', whiteSpace:'nowrap' }}>
                  instantly
                  <svg viewBox="0 0 200 16" style={{ position:'absolute', left:0, bottom:-6, width:'100%', height:14 }}>
                    <path d="M4 11 Q60 3 100 8 T196 6" stroke="var(--coral)" strokeWidth={5} fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p style={{ fontSize:'clamp(17px,2vw,20px)', color:'var(--ink-soft)', maxWidth:480, margin:'22px 0 30px' }}>
                LinguaSign turns Pakistan Sign Language into text and speech in real time — and teaches you to sign back. Built for the Deaf community, learners, and everyone in between.
              </p>
              <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                <Link href="/sign"  className="btn btn-primary btn-lg"><I.Camera size={20} />Try live detection</Link>
                <Link href="/learn" className="btn btn-ghost btn-lg"><I.Play size={18} />Start learning</Link>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:22, marginTop:34, flexWrap:'wrap' }}>
                {[['42','PSL signs live'],['12k+','learners'],['98%','accuracy']].map(([v,l],k,a) => (
                  <div key={k} style={{ display:'flex', alignItems:'center', gap:22 }}>
                    <div><div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:26,color:'var(--ink)' }}>{v}</div><div style={{fontSize:13,color:'var(--ink-faint)'}}>{l}</div></div>
                    {k<a.length-1 && <div style={{ width:1,height:34,background:'var(--line)' }} />}
                  </div>
                ))}
              </div>
            </div>
            <div className="fade-up" style={{ animationDelay:'0.15s', alignSelf:'center' }}>
              <HeroDemo />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={sec}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <Eyebrow icon={I.Bolt} color="violet">How it works</Eyebrow>
          <h2 style={{ fontSize:'clamp(30px,4vw,44px)', marginTop:16 }}>Three steps to understanding</h2>
        </div>
        <div className="ls-3col">
          <Step n="1" Icon={I.Camera}  color="sky"   title="Show your hands"  body="Open the camera and sign naturally. LinguaSign tracks 21 points on each hand, live." />
          <Step n="2" Icon={I.Sparkle} color="green" title="AI reads the sign" body="Our model recognises PSL letters, words and phrases frame-by-frame with high confidence." />
          <Step n="3" Icon={I.Volume}  color="coral" title="Get text + speech" body="See the translation as captions and hear it spoken aloud — in Urdu or English." />
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ ...sec, background:'var(--bg-tint)', borderRadius:'var(--radius-xl)' }}>
        <div className="ls-feat-grid">
          <div>
            <Eyebrow icon={I.Star} color="amber">Why LinguaSign</Eyebrow>
            <h2 style={{ fontSize:'clamp(28px,3.6vw,40px)', margin:'16px 0 14px' }}>Accessibility that feels like play</h2>
            <p style={{ color:'var(--ink-soft)', fontSize:16.5, marginBottom:26 }}>Everything you need to communicate, learn, and grow — wrapped in a bright, friendly interface.</p>
          </div>
          <div style={{ display:'grid', gap:26 }}>
            <Feature Icon={I.Bolt}   color="green"  title="Real-time detection" body="Sub-second recognition that keeps up with natural signing speed." />
            <Feature Icon={I.Volume} color="sky"    title="Text & voice output" body="Captions plus spoken Urdu or English for two-way conversations." />
            <Feature Icon={I.Trophy} color="coral"  title="Gamified lessons"    body="Streaks, levels and quizzes make practising PSL genuinely fun." />
            <Feature Icon={I.Globe}  color="violet" title="Made for Pakistan"   body="Trained on Pakistan Sign Language with Urdu-first translations." />
          </div>
        </div>
      </section>

      {/* ALPHABET EXPLORER */}
      <section style={{ ...sec, textAlign:'center' }}>
        <Eyebrow icon={I.Hand} color="coral">The PSL alphabet</Eyebrow>
        <h2 style={{ fontSize:'clamp(28px,3.6vw,40px)', margin:'16px 0 36px' }}>Start with the basics</h2>
        <AlphabetExplorer />
      </section>

      {/* AUDIENCE */}
      <section style={sec}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <Eyebrow icon={I.User} color="sky">Who it&apos;s for</Eyebrow>
          <h2 style={{ fontSize:'clamp(28px,3.6vw,40px)', marginTop:16 }}>One app, many bridges</h2>
        </div>
        <div className="ls-4col">
          <AudienceCard color="green"  label="Deaf & HoH" title="Be understood" body="Sign naturally and let hearing people read or hear you instantly." />
          <AudienceCard color="coral"  label="Learners"   title="Pick up PSL"   body="Bite-sized lessons and quizzes that build real signing skills." />
          <AudienceCard color="violet" label="Educators"  title="Teach faster"  body="Track classroom progress and assign practice with ease." />
          <AudienceCard color="sky"    label="Businesses" title="Serve everyone" body="Drop-in accessibility for counters, clinics and helplines." />
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'clamp(18px,5vw,64px)', maxWidth:1240, margin:'0 auto 30px' }}>
        <div style={{ borderRadius:'var(--radius-xl)', padding:'clamp(34px,5vw,64px)', textAlign:'center', background:'linear-gradient(135deg,var(--green),var(--green-deep))', color:'white', position:'relative', overflow:'hidden' }}>
          <div className="floaty" style={{ position:'absolute', top:24, left:30, opacity:0.25 }}><I.Hand size={60} /></div>
          <div className="floaty" style={{ position:'absolute', bottom:20, right:40, opacity:0.25, animationDelay:'1s' }}><I.Sparkle size={54} /></div>
          <h2 style={{ fontSize:'clamp(30px,4.5vw,50px)', marginBottom:14, position:'relative' }}>Ready to break the silence?</h2>
          <p style={{ fontSize:18, opacity:0.92, maxWidth:480, margin:'0 auto 28px', position:'relative' }}>Join thousands using LinguaSign to connect across Pakistan Sign Language — free to start.</p>
          <Link href="/auth" className="btn btn-lg" style={{ background:'white', color:'var(--green-deep)', position:'relative' as const }}>
            Create free account <I.ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <LsFooter />
    </div>
  );
}
