'use client';

// Slim dismissible banner shown across the app during the launch free period.
// Sourced from the one launch knob (isLaunchFreePeriod); vanishes automatically
// when the window closes. Dismissal persists locally. No motion beyond a simple
// mount, so nothing to gate on prefers-reduced-motion.

import { useEffect, useState } from 'react';
import { isLaunchFreePeriod, LAUNCH_BANNER_LINE } from '@librato/shared';

const DISMISS_KEY = 'bd-launch-banner-dismissed';

export function LaunchBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isLaunchFreePeriod()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return;
    } catch {
      // storage unavailable — still show the banner
    }
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="mx-auto mb-2 flex w-full max-w-[640px] items-center gap-2.5 rounded-control border border-gilt-500/30 bg-nave-800 px-3.5 py-2 shadow-glow">
      <span aria-hidden className="inline-flex text-gilt-500">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 3v18M6.5 9.5h11" />
        </svg>
      </span>
      <span className="flex-1 font-body text-[12.5px] leading-snug text-vellum-100">
        {LAUNCH_BANNER_LINE}
      </span>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          try {
            localStorage.setItem(DISMISS_KEY, '1');
          } catch {
            /* ignore */
          }
          setShow(false);
        }}
        className="inline-flex flex-none rounded-pill p-1 text-vellum-200/60 transition-colors hover:text-vellum-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}
