'use client';

// Screen Wake Lock — requested while active (the Stillness), re-requested when
// the tab becomes visible again, released on exit. Feature-detected; degrades
// silently where unsupported (SKILL.md §10).

import { useEffect } from 'react';

type WakeLockSentinel = { release: () => Promise<void>; released: boolean };

export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinel> };
    };
    if (!nav.wakeLock) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const request = async () => {
      try {
        sentinel = await nav.wakeLock!.request('screen');
        if (cancelled) await sentinel.release();
      } catch {
        // denied or unsupported in this context — degrade silently
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void request();
    };

    void request();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      if (sentinel && !sentinel.released) void sentinel.release();
    };
  }, [active]);
}
