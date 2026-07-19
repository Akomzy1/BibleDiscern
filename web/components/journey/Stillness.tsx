'use client';

// Step 6 · The Stillness — the quality bar for the whole app. Full-bleed
// nave950: breathing disc (gilt radial, cross center, one faint outer ring),
// "Be still, and know that I am God." — Psalm 46:10, a thin 90s progress arc,
// tiny elapsed time. The single ≤6% glow allowance lives here. After 90s →
// the "What surfaced?" capture. (Frames G / G2)

import { useState } from 'react';
import { GiltButton, StatusChip, TextArea } from '@/components/selah';
import { TRIAL_LINE } from '@librato/shared';
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

// The Stillness Engine is Premium-only. Free users (e.g. viewing a journey
// begun before this became Premium) see the breathing disc behind a lock with a
// trial CTA, and may continue past it to the Prayer.
export function StillnessLocked({
  onStartTrial,
  onSkip,
  busy,
}: {
  onStartTrial: () => void;
  onSkip: () => void;
  busy: boolean;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-nave-950 px-7">
      <div className="pt-safe" />
      <div className="flex-1" />
      <div className="relative">
        <div className="blur-[6px]" aria-hidden>
          <BreathingDisc />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
          <span className="inline-flex text-gilt-300" aria-hidden>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <StatusChip tone="gold">Premium</StatusChip>
        </div>
      </div>
      <div className="mt-6 px-4 text-center">
        <h1 className="font-display text-[27px] font-medium leading-tight text-vellum-100">
          Enter the Stillness
        </h1>
        <p className="mt-2.5 font-body text-[13.5px] leading-[1.55] text-vellum-200/60">
          Ninety seconds of guided silence — the quiet center of the journey, where you listen for
          what the Spirit is saying. Premium opens it.
        </p>
      </div>
      <div className="flex-1" />
      <div className="w-full max-w-[420px] pb-8">
        <GiltButton fullWidth onClick={onStartTrial} disabled={busy}>
          {busy ? 'One moment…' : 'Start free trial'}
        </GiltButton>
        <p className="mt-2.5 text-center font-body text-[12.5px] text-vellum-200/60">{TRIAL_LINE}</p>
        <button
          type="button"
          onClick={onSkip}
          className="mt-2.5 w-full py-1 text-center font-body text-[13px] font-semibold text-vellum-200/60 transition-colors duration-whisper ease-selah hover:text-vellum-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
        >
          Continue without it
        </button>
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
