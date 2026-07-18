'use client';

// The signature element — a hairline gold balance beam with a center fulcrum.
// SVG rotated via CSS transforms only (cheap, 60fps, portable). SKILL.md §5.
// States: at rest (level; faint sway on landing only), tilt-left, tilt-right,
// settled-level with a stone glyph (Ebenezer). Reduced motion disables the
// sway and the settle transition via the .beam-rotor/.beam-stone CSS guard.

export type BeamTilt = 'rest' | 'left' | 'right';

type BeamProps = {
  tilt?: BeamTilt;
  sway?: boolean;
  stone?: boolean;
  /** Journey-progress variant: tick marks along the beam, fulcrum under the active step. */
  progress?: { steps: number; active: number };
  className?: string;
};

const DEG: Record<BeamTilt, number> = { rest: 0, left: -6, right: 6 };

/** Beam-as-progress (journey shell): level beam, N tick marks, sliding fulcrum. */
function BeamProgress({ steps, active }: { steps: number; active: number }) {
  const x0 = 34;
  const x1 = 206;
  const xs = Array.from({ length: steps }, (_, i) => x0 + ((x1 - x0) * i) / (steps - 1));
  return (
    <div className="relative flex w-full justify-center" aria-hidden>
      <svg viewBox="0 0 240 44" className="w-full max-w-xs overflow-visible">
        <line x1={x0} y1="18" x2={x1} y2="18" stroke="var(--gilt)" strokeWidth="1.5" strokeLinecap="round" />
        {xs.map((x, i) => (
          <line
            key={i}
            x1={x}
            y1="14"
            x2={x}
            y2="22"
            stroke="var(--gilt)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={i <= active ? 0.95 : 0.35}
          />
        ))}
        <path
          className="beam-rotor"
          d="M0 24 L-8 38 L8 38 Z"
          fill="var(--gilt)"
          opacity="0.9"
          style={{
            transform: `translateX(${xs[Math.min(active, steps - 1)]}px)`,
            transition: 'transform var(--dur-settle) var(--ease-selah)',
          }}
        />
      </svg>
    </div>
  );
}

export function Beam({ tilt = 'rest', sway = false, stone = false, progress, className }: BeamProps) {
  if (progress) {
    return (
      <div className={className}>
        <BeamProgress steps={progress.steps} active={progress.active} />
      </div>
    );
  }
  return (
    <div className={`relative flex w-full justify-center ${className ?? ''}`} aria-hidden>
      <svg viewBox="0 0 240 60" className="w-52 overflow-visible">
        {/* fulcrum */}
        <path d="M120 40 L112 56 L128 56 Z" fill="var(--gilt)" opacity="0.9" />
        {/* beam — rotates about the fulcrum */}
        <g
          className="beam-rotor"
          style={{
            transformOrigin: '120px 40px',
            transform: `rotate(${DEG[tilt]}deg)`,
            transition: 'transform var(--dur-settle) var(--ease-selah)',
            animation: sway ? 'beam-sway 7s var(--ease-selah) infinite' : undefined,
          }}
        >
          <line
            x1="34"
            y1="40"
            x2="206"
            y2="40"
            stroke="var(--gilt)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* pans */}
          <circle cx="34" cy="40" r="3" fill="var(--gilt)" />
          <circle cx="206" cy="40" r="3" fill="var(--gilt)" />
        </g>
        {stone && (
          <circle
            className="beam-stone"
            cx="120"
            cy="30"
            r="5"
            fill="var(--gilt-300)"
            style={{ animation: 'stone-settle var(--dur-settle) var(--ease-selah)' }}
          />
        )}
      </svg>
    </div>
  );
}
