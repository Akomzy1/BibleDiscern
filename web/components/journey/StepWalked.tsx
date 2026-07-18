// Step 3 · Those who walked before — two narrative cards with the gilt-left
// lesson box. (Frame C)

import type { DiscernmentResponse } from '@librato/shared';
import { GiltButton, Panel } from '@/components/selah';

export function StepWalked({
  ai,
  onContinue,
}: {
  ai: DiscernmentResponse;
  onContinue: () => void;
}) {
  return (
    <>
      <h1 className="mx-2.5 mb-2.5 mt-0.5 text-center font-display text-[21px] font-medium leading-[1.3] text-vellum-100">
        You are not the first to stand here.
      </h1>
      <div className="grid gap-2.5">
        {ai.biblicalNarratives.map((p) => (
          <Panel key={p.character} className="px-4 py-[15px]">
            <div className="mb-2.5 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-pill bg-nave-800 font-display text-xl font-medium text-gilt-300">
                {p.character.charAt(0)}
              </span>
              <span>
                <b className="block font-body text-[15.5px] text-ink-900">{p.character}</b>
                <span className="mt-0.5 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                  {p.reference}
                </span>
              </span>
            </div>
            <p className="font-body text-[13.5px] leading-[1.55] text-ink-900">{p.connection}</p>
            <div className="mt-[11px] rounded-r-lg border-l-2 border-gilt-500 bg-vellum-200 px-3.5 py-3">
              <span className="mb-[5px] block font-body text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">
                The lesson
              </span>
              <span className="font-scripture text-[15.5px] font-medium italic leading-[1.45] text-ink-900">
                {p.lesson}
              </span>
            </div>
          </Panel>
        ))}
      </div>
      <div className="mt-4">
        <GiltButton fullWidth onClick={onContinue}>
          Continue to the Examination
        </GiltButton>
      </div>
    </>
  );
}
