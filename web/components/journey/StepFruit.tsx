'use client';

// Step 5 · The Fruit — radial chart (hairline gilt web, 18% fill) + nine
// readings. PREMIUM ONLY; the locked variant blurs the chart behind a lock +
// Premium chip with a trial CTA. (Frames E / E2)

import { FRUIT_LABELS, TRIAL_LINE } from '@librato/shared';
import type { DiscernmentResponse, FruitValue } from '@librato/shared';
import { GiltButton, Panel, StatusChip } from '@/components/selah';

type Reading = { label: string; score: number; note: string };

function coerce(value: FruitValue): { score: number; note: string } {
  if (typeof value === 'string') return { score: 0.6 * 10, note: value };
  return { score: value.score, note: value.note };
}

export function readings(ai: DiscernmentResponse): Reading[] {
  return (Object.keys(FRUIT_LABELS) as (keyof typeof FRUIT_LABELS)[]).map((key) => {
    const { score, note } = coerce(ai.fruitDiagnostic[key]);
    return { label: FRUIT_LABELS[key], score: Math.max(0, Math.min(1, score / 10)), note };
  });
}

export function FruitRadar({
  data,
  size = 272,
  blur = false,
}: {
  data: Reading[];
  size?: number;
  blur?: boolean;
}) {
  const cx = size / 2;
  const cy = size / 2 + 6;
  const R = size / 2 - 42;
  const n = data.length;
  const pt = (i: number, r: number): [number, number] => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const poly = (f: number) => data.map((_, i) => pt(i, R * f).join(',')).join(' ');
  const val = data.map((d, i) => pt(i, R * d.score).join(',')).join(' ');

  return (
    <svg
      width={size}
      height={size + 8}
      viewBox={`0 0 ${size} ${size + 8}`}
      className="mx-auto block"
      style={{ filter: blur ? 'blur(6px)' : 'none' }}
      aria-hidden
    >
      {[0.33, 0.66, 1].map((f) => (
        <polygon
          key={f}
          points={poly(f)}
          fill="none"
          stroke="rgba(200,164,94,.55)"
          strokeOpacity={f === 1 ? 0.7 : 0.35}
          strokeWidth="1"
        />
      ))}
      {data.map((_, i) => {
        const [x, y] = pt(i, R);
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(200,164,94,.55)" strokeOpacity=".25" strokeWidth="1" />
        );
      })}
      <polygon points={val} fill="rgba(200,164,94,.18)" stroke="var(--gilt)" strokeWidth="1" />
      {data.map((d, i) => {
        const [x, y] = pt(i, R * d.score);
        return <circle key={i} cx={x} cy={y} r="2" fill="var(--gilt)" />;
      })}
      {data.map((d, i) => {
        const [x, y] = pt(i, R + 16);
        const c = Math.cos((Math.PI * 2 * i) / n - Math.PI / 2);
        return (
          <text
            key={i}
            x={x}
            y={y + 3}
            textAnchor={Math.abs(c) < 0.3 ? 'middle' : c > 0 ? 'start' : 'end'}
            fill="rgba(253,246,236,.62)"
            fontSize="10"
            fontWeight="600"
            letterSpacing=".06em"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

const INTRO = 'Your journey, measured against the fruit of the Spirit. — Galatians 5:22-23';

export function StepFruit({
  ai,
  onContinue,
}: {
  ai: DiscernmentResponse;
  onContinue: () => void;
}) {
  const data = readings(ai);
  return (
    <>
      <p className="mx-2.5 mb-3.5 mt-1.5 text-center font-body text-[13px] leading-normal text-vellum-200/60">
        {INTRO}
      </p>
      <div className="rounded-panel border border-gilt-edge bg-nave-800 px-2 pb-2.5 pt-3.5 shadow-glow">
        <FruitRadar data={data} />
      </div>
      <Panel className="mt-3.5 px-[18px] py-1.5">
        {data.map((d, i) => (
          <div
            key={d.label}
            className={`flex items-baseline gap-3 py-[11px] ${i ? 'border-t border-ink-900/15' : ''}`}
          >
            <b className="w-[104px] flex-none font-body text-[13.5px] text-ink-900">{d.label}</b>
            <span className="flex-1 font-body text-[12.5px] leading-normal text-ink-500">
              {d.note}
            </span>
          </div>
        ))}
      </Panel>
      <div className="mt-3.5">
        <GiltButton fullWidth onClick={onContinue}>
          Continue to the Stillness
        </GiltButton>
      </div>
    </>
  );
}

export function StepFruitLocked({
  ai,
  onStartTrial,
  onSkip,
  busy,
}: {
  ai: DiscernmentResponse;
  onStartTrial: () => void;
  onSkip: () => void;
  busy: boolean;
}) {
  const data = readings(ai);
  return (
    <>
      <p className="mx-2.5 mb-3.5 mt-1.5 text-center font-body text-[13px] leading-normal text-vellum-200/60">
        {INTRO}
      </p>
      <div className="relative overflow-hidden rounded-panel border border-gilt-edge bg-nave-800 px-2 pb-2.5 pt-3.5 shadow-glow">
        <FruitRadar data={data} blur />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-nave-950/35">
          <span className="inline-flex text-gilt-300" aria-hidden>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <StatusChip tone="gold">Premium</StatusChip>
        </div>
      </div>
      <div className="mt-[22px] px-6 text-center">
        <h2 className="font-display text-2xl font-medium leading-[1.25] text-vellum-100">
          See where your heart aligns
        </h2>
        <p className="mt-2.5 font-body text-[13.5px] leading-[1.55] text-vellum-200/60">
          Nine readings drawn from what you have written on this journey — where the Spirit&apos;s
          fruit is already growing, and where it is thin.
        </p>
      </div>
      <div className="flex-1" />
      <GiltButton fullWidth onClick={onStartTrial} disabled={busy}>
        {busy ? 'One moment…' : 'Start free trial'}
      </GiltButton>
      <p className="mt-2.5 text-center font-body text-[12.5px] text-vellum-200/60">{TRIAL_LINE}</p>
      <button
        type="button"
        onClick={onSkip}
        className="mt-2.5 py-1 text-center font-body text-[13px] font-semibold text-vellum-200/60 transition-colors duration-whisper ease-selah hover:text-vellum-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
      >
        Skip to the Stillness
      </button>
    </>
  );
}
