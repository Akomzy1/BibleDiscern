'use client';

// SEE reveal — one of the four orchestrated motion moments. Bars fill 0→final
// and numerals count 0→final over 1.5s ease-out. Reduced motion jumps to the
// final state. (Today prototype, Frame 2)

import { useEffect, useState } from 'react';

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function useCount(target: number, durationMs = 1500) {
  const [n, setN] = useState(() => (prefersReducedMotion() ? target : 0));
  useEffect(() => {
    if (prefersReducedMotion()) {
      setN(target);
      return;
    }
    let raf: number;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / durationMs);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return n;
}

type BarProps = {
  side: 'a' | 'b';
  label: string;
  percent: number;
  run: boolean;
};

function Bar({ side, label, percent, run }: BarProps) {
  const n = useCount(percent);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="font-body text-sm font-semibold text-ink-900">
          <span className="mr-2 text-xs font-bold uppercase text-ink-500">{side}</span>
          {label}
        </span>
        <span className="font-display text-[38px] font-medium leading-none text-ink-900">
          {n}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-pill bg-ink-900/[0.08]">
        <div
          className={`h-full rounded-pill motion-reduce:transition-none ${
            side === 'a' ? 'bg-nave-800' : 'bg-gilt-500'
          }`}
          style={{
            width: run ? `${percent}%` : '0%',
            transition: 'width var(--dur-reveal) cubic-bezier(.16,1,.3,1)',
          }}
        />
      </div>
    </div>
  );
}

type ResultBarsProps = {
  sideALabel: string;
  sideBLabel: string;
  percentA: number;
  percentB: number;
};

export function ResultBars({ sideALabel, sideBLabel, percentA, percentB }: ResultBarsProps) {
  const [run, setRun] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setRun(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="grid gap-[22px]">
      <Bar side="a" label={sideALabel} percent={percentA} run={run} />
      <Bar side="b" label={sideBLabel} percent={percentB} run={run} />
    </div>
  );
}
