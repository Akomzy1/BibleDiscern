'use client';

// Step 7 · The Prayer — gilt-top prayer card, olive stillness-note echo,
// disclaimer microcopy, then "Set my Ebenezer Stone": beam levels, stone
// settles (one of the four orchestrated moments). (Frame F)

import { useState } from 'react';
import { DISCLAIMER } from '@librato/shared';
import type { DiscernmentResponse } from '@librato/shared';
import { Beam, GiltButton, Panel, PrayerCard } from '@/components/selah';
import type { UseJourney } from '@/hooks/useJourney';

export function StepPrayer({ ai, j }: { ai: DiscernmentResponse; j: UseJourney }) {
  const [setting, setSetting] = useState(false);
  const [stone, setStone] = useState(false);

  const setEbenezer = async () => {
    if (setting) return;
    setSetting(true);
    setStone(true); // beam levels, the stone settles
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await new Promise((r) => setTimeout(r, reduced ? 0 : 700));
    const ok = await j.complete();
    if (ok) {
      window.location.assign('/journal');
    } else {
      setSetting(false);
      setStone(false);
    }
  };

  return (
    <>
      <Panel className="mt-1 p-[18px]">
        <PrayerCard>{ai.prayer}</PrayerCard>
        {j.stillnessNote && (
          <div className="mt-3.5 rounded-r-lg border border-ink-900/15 border-l-[3px] border-l-olive-500 bg-vellum-100 px-3.5 py-3">
            <span className="mb-[5px] block font-body text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">
              From your stillness
            </span>
            <span className="font-scripture text-[15.5px] font-medium italic leading-[1.45] text-ink-900">
              &ldquo;{j.stillnessNote}&rdquo;
            </span>
          </div>
        )}
        <p className="mx-0.5 mb-0.5 mt-3.5 font-body text-[12.5px] italic leading-[1.55] text-ink-500">
          {DISCLAIMER}
        </p>
      </Panel>
      <div className="flex-1" />
      <div className="px-10">
        <Beam tilt="rest" stone={stone} />
      </div>
      <div
        aria-hidden
        className="mx-auto mb-3.5 mt-2.5 h-[11px] w-4 border border-gilt-500/35 bg-nave-700"
        style={{ borderRadius: '50% 50% 46% 46%' }}
      />
      {j.errorMessage && (
        <p className="mb-3 text-center font-body text-sm text-ember-600">{j.errorMessage}</p>
      )}
      <GiltButton fullWidth onClick={() => void setEbenezer()} disabled={setting}>
        {setting ? 'Setting…' : 'Set my Ebenezer Stone'}
      </GiltButton>
    </>
  );
}
