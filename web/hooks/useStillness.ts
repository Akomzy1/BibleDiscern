'use client';

// The Stillness — owns the 90s timer and the wake lock. After 90s the caller
// shows the "What surfaced?" capture. Pure timing logic, no rendering.

import { useEffect, useRef, useState } from 'react';
import { STILLNESS } from '@librato/shared';
import { useWakeLock } from './useWakeLock';

export function useStillness({ onComplete }: { onComplete?: () => void } = {}) {
  const total = STILLNESS.totalDurationMs;
  const [elapsedMs, setElapsedMs] = useState(0);
  const doneRef = useRef(false);
  const done = elapsedMs >= total;

  useWakeLock(!done);

  useEffect(() => {
    const t0 = performance.now();
    const id = setInterval(() => {
      setElapsedMs(Math.min(total, performance.now() - t0));
    }, 250);
    return () => clearInterval(id);
  }, [total]);

  useEffect(() => {
    if (done && !doneRef.current) {
      doneRef.current = true;
      onComplete?.();
    }
  }, [done, onComplete]);

  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const prompt =
    elapsedMs < STILLNESS.phaseTransitionMs ? STILLNESS.phase1Prompt : STILLNESS.phase2Prompt;

  return {
    elapsedMs,
    elapsedLabel: `${Math.floor(elapsedSeconds / 60)}:${String(elapsedSeconds % 60).padStart(2, '0')}`,
    progress: elapsedMs / total,
    prompt,
    done,
  };
}
