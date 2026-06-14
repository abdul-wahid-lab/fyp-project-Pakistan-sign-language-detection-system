import React from 'react';

export type IconProps = { size?: number; sw?: number; style?: React.CSSProperties; className?: string };

function S({ size = 22, sw = 2, fill = 'none', children }: IconProps & { fill?: string; children?: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
function P(d: string, extra?: Partial<IconProps & { fill?: string }>) {
  return function Icon(p: IconProps) {
    return <S {...extra} {...p}><path d={d} /></S>;
  };
}

export const Camera = (p: IconProps) => <S {...p}><path d="M3 8.5A2 2 0 0 1 5 6.5h1.5l1-2h7l1 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/></S>;
export const Book    = P('M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 1 2-2h13');
export const Chart   = (p: IconProps) => <S {...p}><path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/></S>;
export const Gear    = (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3"/></S>;
export const User    = (p: IconProps) => <S {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></S>;
export const Flame   = P('M12 3c1 3-1.5 4.5-1.5 7A3.5 3.5 0 0 0 16 12c1.5 2 .5 8-4 8s-6-4-4.5-7C8.5 11 9 9 8.5 7.5 10 8 11 6 12 3Z');
export const Check   = P('M5 12.5 10 17.5 19 7');
export const X       = P('M6 6l12 12M18 6 6 18');
export const Mic     = (p: IconProps) => <S {...p}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></S>;
export const Sun     = (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></S>;
export const Moon    = P('M20 14.5A8 8 0 0 1 9.5 4 7 7 0 1 0 20 14.5Z');
export const Play    = P('M7 5l12 7-12 7z', { fill: 'currentColor', sw: 0 });
export const Bookmark= P('M6 4h12v17l-6-4-6 4z');
export const Search  = (p: IconProps) => <S {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></S>;
export const ArrowRight = P('M5 12h14M13 6l6 6-6 6');
export const ArrowLeft  = P('M19 12H5M11 18l-6-6 6-6');
export const Wave    = P('M7 11V6.5a1.5 1.5 0 0 1 3 0V11m0-.5V5a1.5 1.5 0 0 1 3 0v6m0-.5V6.5a1.5 1.5 0 0 1 3 0V13c0 4-2.5 7-6 7s-6-2.5-6.5-5.5c-.3-1.7 1.7-2.3 2.5-.8L7 11', { sw: 1.8 });
export const Hand    = P('M8 13V5.5a1.5 1.5 0 0 1 3 0V11m0-.5V4a1.5 1.5 0 0 1 3 0v7m0-.5V5.5a1.5 1.5 0 0 1 3 0V14c0 4-2 7-6 7s-5.5-2.3-6.5-4.5c-.6-1.3-1.2-2.4-1.8-3.2-.7-1 .6-2.3 1.8-1.3L8 13', { sw: 1.8 });
export const Sparkle = P('M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z');
export const Bolt    = P('M13 2 4 14h7l-1 8 9-12h-7z');
export const Volume  = (p: IconProps) => <S {...p}><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 7a7 7 0 0 1 0 10"/></S>;
export const Globe   = (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></S>;
export const Bell    = P('M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 21a2 2 0 0 0 4 0');
export const Trophy  = P('M7 4h10v4a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 18h6M10 14v4M14 14v4M8 21h8');
export const Star    = P('M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.8 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z');
export const Target  = (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></S>;
export const Clock   = (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></S>;
export const Logout  = P('M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3M10 12h9M16 8l3 4-3 4');
export const Eye     = (p: IconProps) => <S {...p}><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"/><circle cx="12" cy="12" r="3"/></S>;
export const Facebook= P('M14 8.5h2V5.5h-2.2A3.3 3.3 0 0 0 10.5 9v2H8.5v3h2v6h3v-6h2.2l.3-3h-2.5V9.2c0-.5.3-.7.8-.7z', { sw: 1.6 });
export const Twitter = P('M5.5 5.5l5.6 7.4-5.9 5.6M18.5 18.5l-5.6-7.4 5.6-5.6', { sw: 1.8 });
export const Instagram = (p: IconProps) => <S {...p}><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.6" cy="7.4" r="0.9" fill="currentColor"/></S>;
export const LinkedIn  = (p: IconProps) => <S {...p}><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 10.5v5M8 7.6v.1M11.5 15.5v-3a1.8 1.8 0 0 1 3.6 0v3" strokeWidth={1.7}/></S>;
export const YouTube   = (p: IconProps) => <S {...p}><rect x="3" y="6.5" width="18" height="11" rx="3.5"/><path d="M10.5 9.5l4 2.5-4 2.5z" fill="currentColor" strokeWidth={0}/></S>;
