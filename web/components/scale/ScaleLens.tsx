// The Scripture Lens — the LEARN content of a Daily Scale (reference, verse,
// the teaching that never declares a winner, closing prayer). Extracted from
// DailyScale so BOTH the live Today screen and the /admin preview render the
// exact same component (the admin spec requires the preview to go through the
// REAL LEARN component, not a lookalike). Render-only.

import type { DailyScale as Scale } from '@librato/shared';
import { Eyebrow, Panel, ScriptureBlock, PrayerCard } from '@/components/selah';

export function ScaleLens({
  scale,
  children,
}: {
  scale: Scale;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mt-2.5 text-center">
        <Eyebrow className="justify-center">The Scripture Lens</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl font-medium leading-tight text-gilt-500">
          {scale.scripture_reference}
        </h2>
      </div>

      <Panel className="mt-4 p-5">
        <div className="rounded-control bg-vellum-200 px-4 py-[18px]">
          <ScriptureBlock>{scale.scripture_text ?? ''}</ScriptureBlock>
          <p className="mt-2 font-body text-sm text-ink-500">— {scale.scripture_reference}</p>
        </div>
        <p className="mx-0.5 mt-4 font-body text-[14.5px] leading-[1.6] text-ink-900">
          {scale.scripture_lens}
        </p>
        <PrayerCard className="mt-4">{scale.prayer}</PrayerCard>
        {children}
      </Panel>
    </div>
  );
}
