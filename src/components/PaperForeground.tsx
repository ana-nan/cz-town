import type { CSSProperties } from 'react';

// Separate cardstock silhouettes sit in front of the world, never over the HUD.
const clusters = [
  { x: 12, y: 98, r: -34, s: 1.1 }, { x: 64, y: 82, r: -18, s: .85 },
  { x: 103, y: 125, r: 20, s: 1.2 }, { x: 155, y: 121, r: 42, s: .78 },
  { x: 197, y: 155, r: 57, s: .7 },
];
function Foliage({ near = false }: { near?: boolean }) {
  return <svg viewBox="0 0 310 250" fill="none" aria-hidden="true">
    <path d="M-20 250V150Q35 137 70 170Q120 147 165 188Q217 167 280 234L310 250Z" fill={near ? '#438b70' : '#99bf63'}/>
    {clusters.map((leaf, index) => <g key={index} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`}>
      <path d="M0 128Q-6 65 3-8" stroke={near ? '#d9cb89' : '#b6c879'} strokeWidth="3"/>
      <path d="M1 56C-47 57-48 10-43-13C-11-9 4 12 1 56Z" fill={near ? '#73ad63' : '#b4d777'}/>
      <path d="M3 85C51 76 61 43 48 20C14 27 1 47 3 85Z" fill={near ? '#96c968' : '#c9df87'}/>
      <path d="M2 17C-15-2-13-39 1-57C22-34 24-8 2 17Z" fill={near ? '#b6d976' : '#d8e9a0'}/>
      <path d="M-1 53L-35-4M5 80L42 31M2 12L2-41" stroke="#f1e8bb" strokeOpacity=".22" strokeWidth="1.2"/>
    </g>)}
  </svg>;
}
export function PaperForeground({ x, y }: { x: number; y: number }) {
  return <div className="paper-foreground" aria-hidden="true" style={{ '--paper-x': `${Math.max(-9, Math.min(9, (800-x)*.025))}px`, '--paper-y': `${Math.max(-4, Math.min(4, (700-y)*.02))}px` } as CSSProperties}>
    <div className="paper-wing paper-wing-left"><div className="paper-foliage-back"><Foliage/></div><div className="paper-foliage-front"><Foliage near/></div></div>
    <div className="paper-wing paper-wing-right"><div className="paper-foliage-back"><Foliage/></div><div className="paper-foliage-front"><Foliage near/></div></div>
  </div>;
}
