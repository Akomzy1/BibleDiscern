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
  className?: string;
};

const DEG: Record<BeamTilt, number> = { rest: 0, left: -6, right: 6 };

export function Beam({ tilt = 'rest', sway = false, stone = false, className }: BeamProps) {
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
