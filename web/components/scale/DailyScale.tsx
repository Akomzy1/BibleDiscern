'use client';

// The Daily Scale — three phases (WEIGH / SEE / LEARN) + completed-collapsed,
// each a faithful translation of its Today prototype frame
// (docs/prototypes/today-screen.html). Behavior lives in useDailyScale; this
// file only renders.

import type { DailyScale as Scale, DailyScaleResults } from '@librato/shared';
import type { UseDailyScale } from '@/hooks/useDailyScale';
import {
  Beam,
  Panel,
  Eyebrow,
  GiltButton,
  StatusChip,
  VellumGrain,
} from '@/components/selah';
import { ResultBars } from './ResultBars';
import { ShareCard } from './ShareCard';
import { ScaleLens } from './ScaleLens';

// ─── Small icons (hairline stroke, per prototype) ────────────────────────────

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.2 5-4.8 2 2.2-5 4.8-2Z" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ─── WEIGH ───────────────────────────────────────────────────────────────────

function SideCard({
  side,
  label,
  argument,
  selected,
  dimmed,
  onSelect,
  disabled,
}: {
  side: 'a' | 'b';
  label: string;
  argument: string;
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={`relative overflow-hidden rounded-control bg-vellum-100 text-left transition-all duration-settle ease-selah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 ${
        selected
          ? '-translate-y-[3px] border-2 border-gilt-500 p-[13px] shadow-[0_6px_18px_rgba(200,164,94,0.22)]'
          : 'border border-ink-900/10 p-3.5'
      } ${dimmed ? 'opacity-60' : ''}`}
    >
      <VellumGrain />
      <span className="relative block">
        <span className="mb-[7px] flex items-center gap-2">
          <span
            className={`inline-flex h-6 w-6 flex-none items-center justify-center rounded-pill font-display text-[13px] font-medium ${
              side === 'a' ? 'bg-nave-800 text-vellum-100' : 'bg-gilt-500 text-nave-900'
            }`}
          >
            {side.toUpperCase()}
          </span>
          <b className="font-body text-[13.5px] leading-[1.25] text-ink-900">{label}</b>
        </span>
        <span className="block font-body text-[12.5px] leading-normal text-ink-500">
          {argument}
        </span>
      </span>
    </button>
  );
}

function todayLine() {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function WeighPhase({ scale, s }: { scale: Scale; s: UseDailyScale }) {
  const { selected } = s;
  return (
    <div>
      <div className="mt-2.5 text-center">
        <Eyebrow className="justify-center">Today&apos;s Daily Scale</Eyebrow>
        <div className="mt-1.5 font-body text-xs text-vellum-200/60">{todayLine()}</div>
      </div>

      <Beam
        tilt={selected === 'a' ? 'left' : selected === 'b' ? 'right' : 'rest'}
        sway={!selected}
        className="my-1.5"
      />

      <Panel className="p-5">
        <p className="px-1 text-center font-scripture text-xl font-medium italic leading-[1.4] text-ink-900">
          {scale.question}
        </p>
        <div className="mt-[18px] grid grid-cols-2 items-start gap-2.5">
          <SideCard
            side="a"
            label={scale.side_a_label}
            argument={scale.side_a_argument}
            selected={selected === 'a'}
            dimmed={selected === 'b'}
            onSelect={() => s.selectSide('a')}
            disabled={s.submitting}
          />
          <SideCard
            side="b"
            label={scale.side_b_label}
            argument={scale.side_b_argument}
            selected={selected === 'b'}
            dimmed={selected === 'a'}
            onSelect={() => s.selectSide('b')}
            disabled={s.submitting}
          />
        </div>
        <p className="mt-4 text-center font-body text-[13px] italic text-ink-500">
          Weigh carefully. You can only choose once.
        </p>
      </Panel>

      {selected && (
        <div className="mt-3.5">
          <GiltButton fullWidth onClick={() => void s.confirmVote()} disabled={s.submitting}>
            {s.submitting ? 'Weighing…' : 'Confirm my choice'}
          </GiltButton>
        </div>
      )}

      {s.errorMessage && (
        <p className="mt-3 text-center font-body text-sm text-ember-600">{s.errorMessage}</p>
      )}
    </div>
  );
}

// ─── SEE ─────────────────────────────────────────────────────────────────────

function SeePhase({
  scale,
  results,
  s,
}: {
  scale: Scale;
  results: DailyScaleResults;
  s: UseDailyScale;
}) {
  const leaning = results.percent_a >= results.percent_b ? 'A' : 'B';
  return (
    <div>
      <div className="mt-2.5 text-center">
        <Eyebrow className="justify-center">Today&apos;s Daily Scale</Eyebrow>
        <p className="mx-6 mt-2.5 font-scripture text-[17px] font-medium italic leading-[1.4] text-vellum-100">
          {scale.question}
        </p>
      </div>

      <Panel className="mt-[18px] p-[22px]">
        <ResultBars
          sideALabel={scale.side_a_label}
          sideBLabel={scale.side_b_label}
          percentA={results.percent_a}
          percentB={results.percent_b}
        />
        <p className="mt-5 text-center font-body text-[13px] text-ink-500">
          {results.total.toLocaleString('en-US')} believers weighed in
        </p>
        <p className="mt-2 text-center font-body text-sm font-semibold text-olive-500">
          {s.isMajority
            ? "You're with the majority — but the minority has wisdom too."
            : "You're in the minority — and that's okay. Discernment isn't a vote."}
        </p>
        <div className="mt-[18px] text-center">
          <button
            type="button"
            onClick={s.goToLearn}
            className="font-body text-sm font-semibold text-gilt-500 transition-colors duration-whisper ease-selah hover:text-gilt-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
          >
            See the Scripture Lens →
          </button>
        </div>
      </Panel>

      <p className="mt-3.5 text-center font-body text-[12.5px] text-vellum-200/60">
        The community leans {leaning}, but the Spirit speaks louder than the crowd.
      </p>
    </div>
  );
}

// ─── LEARN ───────────────────────────────────────────────────────────────────

const PAST_PLACEHOLDERS = [
  "Is it gossip if it's true?",
  'Tithe on gross or net?',
  'Move my parents in?',
  'Homeschool or public?',
  'Sunday work shift?',
  'Lend to a friend?',
  'Quiet quit or speak?',
];

function MiniScale({ q }: { q: string }) {
  return (
    <div className="relative w-[118px] flex-none overflow-hidden rounded-control border border-ink-900/10 bg-vellum-100 p-2.5">
      <VellumGrain />
      <div className="relative blur-[3px]">
        <p className="font-scripture text-[11.5px] italic leading-[1.35] text-ink-900">{q}</p>
        <div className="mt-2 h-[5px] w-[70%] rounded-pill bg-nave-800" />
        <div className="mt-1 h-[5px] w-[45%] rounded-pill bg-gilt-500" />
      </div>
    </div>
  );
}

function LearnPhase({ scale }: { scale: Scale }) {
  return (
    <div>
      <ScaleLens scale={scale}>
        <div className="mt-4">
          <ShareCard question={scale.question} />
        </div>
      </ScaleLens>

      {/* Past scales — locked strip (Premium) */}
      <div className="mt-[22px]">
        <div className="flex items-baseline justify-between px-0.5">
          <Eyebrow>Past scales</Eyebrow>
          <span className="font-body text-xs text-vellum-200/60">7 this week</span>
        </div>
        <div className="relative mt-2.5 overflow-hidden rounded-control">
          <div className="flex gap-2">
            {PAST_PLACEHOLDERS.map((q) => (
              <MiniScale key={q} q={q} />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center gap-2.5 bg-nave-900/45">
            <span className="inline-flex text-vellum-100">
              <LockIcon className="h-4 w-4" />
            </span>
            <StatusChip tone="gold">Premium</StatusChip>
          </div>
        </div>
      </div>

      {/* Quiet entry into a Deep Discernment */}
      <a
        href="/discern"
        className="mt-3.5 flex min-h-[56px] items-center gap-3 rounded-panel border border-gilt-edge bg-nave-800 px-4 py-3 text-left shadow-glow transition-colors duration-whisper ease-selah hover:bg-nave-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
      >
        <span className="inline-flex text-gilt-300">
          <CompassIcon className="h-5 w-5" />
        </span>
        <span className="flex-1">
          <span className="block font-body text-[14.5px] font-semibold text-vellum-100">
            Begin a Deep Discernment
          </span>
          <span className="mt-0.5 block font-body text-[12.5px] text-vellum-200/60">
            Bring a decision of your own before God.
          </span>
        </span>
        <span className="inline-flex text-vellum-200/60">
          <ChevronRightIcon className="h-4 w-4" />
        </span>
      </a>
    </div>
  );
}

// ─── COMPLETED (collapsed) ───────────────────────────────────────────────────

function CompletedCard({ scale, s }: { scale: Scale; s: UseDailyScale }) {
  const voteLabel =
    s.data?.userVote === 'a'
      ? `Weighed A — ${scale.side_a_label}`
      : s.data?.userVote === 'b'
        ? `Weighed B — ${scale.side_b_label}`
        : 'Weighed in';
  return (
    <div className="pt-5">
      <Eyebrow className="mb-2.5">Today&apos;s Daily Scale · complete</Eyebrow>
      <button
        type="button"
        onClick={s.goToLearn}
        className="relative w-full overflow-hidden rounded-panel border border-gilt-500/[0.18] bg-vellum-100 px-[18px] py-4 text-left shadow-glow transition-transform duration-whisper ease-selah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 active:scale-[0.995]"
      >
        <VellumGrain />
        <span className="relative flex items-start gap-3">
          <span className="flex-1">
            <span className="block font-scripture text-[17px] font-medium italic leading-[1.4] text-ink-900">
              {scale.question}
            </span>
            <span className="mt-3 flex flex-wrap items-center gap-2.5">
              <StatusChip tone="success">{voteLabel}</StatusChip>
              {scale.scripture_reference && (
                <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
                  {scale.scripture_reference}
                </span>
              )}
            </span>
          </span>
          <span className="mt-1 inline-flex text-ink-500">
            <ChevronDownIcon className="h-[18px] w-[18px]" />
          </span>
        </span>
      </button>
      <p className="mt-3 text-center font-body text-[12.5px] text-vellum-200/60">
        Thus far the Lord has helped us.
      </p>
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

export function DailyScale({ s }: { s: UseDailyScale }) {
  if (!s.data) return null;
  const { scale } = s.data;

  switch (s.phase) {
    case 'weigh':
      return <WeighPhase scale={scale} s={s} />;
    case 'see':
      return s.data.results ? (
        <SeePhase scale={scale} results={s.data.results} s={s} />
      ) : (
        <LearnPhase scale={scale} />
      );
    case 'learn':
      return <LearnPhase scale={scale} />;
    case 'completed':
      return <CompletedCard scale={scale} s={s} />;
  }
}
