'use client';

// The Deep Discernment journey is Premium-only. Free users hit this lock at
// every entry point (empty hub, /discern/new). Same upgrade pattern as the
// Fruit lock: gilt lock + Premium chip, one trial CTA into /upgrade. The server
// (/api/discern) enforces the same gate — this is the visible half of it.

import Link from 'next/link';
import { GiltButton, Panel, StatusChip } from '@/components/selah';
import { TRIAL_LINE } from '@librato/shared';

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function JourneyUpgradeLock() {
  return (
    <Panel className="p-6 text-center">
      <div className="flex items-center justify-center gap-2.5">
        <span className="inline-flex text-gilt-500" aria-hidden>
          <LockIcon />
        </span>
        <StatusChip tone="gold">Premium</StatusChip>
      </div>
      <h2 className="mt-3.5 font-display text-xl font-medium leading-[1.25] text-ink-900">
        Deep Discernment is a Premium journey
      </h2>
      <p className="mt-2.5 font-body text-[13.5px] leading-[1.55] text-ink-500">
        Premium opens every Deep Discernment — Scripture chosen for your decision, honest
        examination, the Stillness, and a prayer to close. Bring any decision you carry.
      </p>
      <div className="mt-5">
        <Link href="/upgrade">
          <GiltButton fullWidth>Start my 7-day free trial</GiltButton>
        </Link>
      </div>
      <p className="mt-3 font-body text-xs text-ink-500">{TRIAL_LINE}</p>
    </Panel>
  );
}
