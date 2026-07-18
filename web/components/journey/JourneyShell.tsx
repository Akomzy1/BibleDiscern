'use client';

// The journey shell — no tab bar; back + "Save & exit", Beam-as-progress
// (7 marks, fulcrum under the active step), step eyebrow.
// (docs/prototypes/deep-discernment.html)

import Link from 'next/link';
import { Beam, Eyebrow } from '@/components/selah';

export const JOURNEY_STEPS_LABELS = [
  'Crossroads',
  'The Word',
  'Those who walked before',
  'The Examination',
  'The Fruit',
  'The Stillness',
  'The Prayer',
] as const;

type JourneyShellProps = {
  step: number; // 1-based
  onBack: () => void;
  children: React.ReactNode;
};

export function JourneyShell({ step, onBack, children }: JourneyShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-nave-900 text-vellum-100">
      <div className="pt-safe" />
      <div className="flex min-h-[40px] items-center justify-between px-2.5">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="inline-flex h-11 w-11 items-center justify-center text-vellum-200/60 transition-colors duration-whisper ease-selah hover:text-vellum-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
        <Link
          href="/discern"
          className="inline-flex min-h-[44px] items-center px-3.5 font-body text-[13px] font-semibold text-vellum-200/60 transition-colors duration-whisper ease-selah hover:text-vellum-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
        >
          Save &amp; exit
        </Link>
      </div>
      <div className="px-[30px]">
        <Beam progress={{ steps: 7, active: step - 1 }} />
      </div>
      <div className="mt-0.5 text-center">
        <Eyebrow className="justify-center">
          Step {step} — {JOURNEY_STEPS_LABELS[step - 1]}
        </Eyebrow>
      </div>
      <div className="mx-auto flex w-full max-w-[640px] flex-1 flex-col px-4 pb-4 pt-3.5">
        {children}
      </div>
    </div>
  );
}
