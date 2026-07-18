'use client';

// Step 6 · The Stillness — the quality bar for the whole app. Full-bleed
// nave950: breathing disc (gilt radial, cross center, one faint outer ring),
// "Be still, and know that I am God." — Psalm 46:10, a thin 90s progress arc,
// tiny elapsed time. The single ≤6% glow allowance lives here. After 90s →
// the "What surfaced?" capture. (Frames G / G2)

import { useState } from 'react';
import { GiltButton, TextArea } from '@/components/selah';
import { useStillness } from '@/hooks/useStillness';

const R = 131;
const C = 2 * Math.PI * R;

function BreathingDisc() {
  return (
    <div className="relative flex h-[290px] w-[290px] items-center justify-center">
      {/* 90s progress arc — drawn by the parent via CSS var */}
      <svg width="290" height="290" viewBox="0 0 290 290" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="145" cy="145" r={R} fill="none" stroke="rgba(200,164,94,.1)" strokeWidth="1" />
        <circle
          cx="145"
          cy="145"
          r={R}
          fill="none"
          stroke="rgba(200,164,94,.42)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={`calc(${C} * var(--stillness-progress, 0)) ${C}`}
          style={{ transition: 'stroke-dasharray 250ms linear' }}
        />
      </svg>
      {/* the breathing disc — 4s in / 2s hold / 4s out */}
      <div
        className="breathe-disc absolute left-1/2 top-1/2 h-[215px] w-[215px] -translate-x-1/2 -translate-y-1/2 rounded-pill"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(200,164,94,.13), rgba(200,164,94,.02) 72%)',
          animation: 'breathe 10s var(--ease-selah) infinite',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="none"
          stroke="var(--gilt-300)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        >
          <path d="M12 3v18" />
          <path d="M6.5 9.5h11" />
        </svg>
      </div>
    </div>
  );
}

export function Stillness({
  onFinished,
}: {
  onFinished: (note: string) => void;
}) {
  const s = useStillness();
  const [note, setNote] = useState('');

  if (s.done) {
    return (
      <div className="flex min-h-screen flex-col bg-nave-950">
        <div className="pt-safe" />
        <div className="flex-1" />
        <div className="px-7">
          <h1 className="mb-[18px] text-center font-display text-[27px] font-medium leading-tight text-vellum-100">
            What surfaced?
          </h1>
          <TextArea
            onNavy
            rows={5}
            placeholder="Write only what is true…"
            aria-label="What surfaced"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="mt-[18px]">
            <GiltButton fullWidth onClick={() => onFinished(note)}>
              Continue
            </GiltButton>
          </div>
        </div>
        <div className="flex-[1.3]" />
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen flex-col items-center overflow-hidden bg-nave-950"
      style={{ '--stillness-progress': s.progress } as React.CSSProperties}
    >
      {/* the ONE candle glow (≤6%) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[230px] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-pill"
        style={{ background: 'radial-gradient(circle, var(--glow), transparent 65%)' }}
      />
      <div className="pt-safe" />
      <div className="flex-1" />
      <BreathingDisc />
      <div className="mt-9 px-11 text-center">
        <p className="font-scripture text-[22px] font-medium italic leading-[1.45] text-gilt-300">
          {s.prompt}
        </p>
        <p className="mt-2 font-body text-sm text-vellum-200/40">— Psalm 46:10</p>
      </div>
      <div className="flex-1" />
      <p className="mb-8 font-body text-[11px] font-semibold tracking-[0.1em] text-vellum-100/35">
        {s.elapsedLabel}
      </p>
    </div>
  );
}
