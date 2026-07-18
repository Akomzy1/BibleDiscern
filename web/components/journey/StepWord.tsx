// Step 2 · The Word — three scripture cards, each with the drop cap. (Frame B)

import type { DiscernmentResponse } from '@librato/shared';
import { GiltButton, Panel, ScriptureBlock } from '@/components/selah';

export function StepWord({
  ai,
  onContinue,
}: {
  ai: DiscernmentResponse;
  onContinue: () => void;
}) {
  return (
    <>
      <p className="mx-2.5 mb-3.5 mt-1.5 text-center font-body text-[13px] leading-normal text-vellum-200/60">
        Three passages, chosen for your decision. Read slowly.
      </p>
      <div className="grid gap-3.5">
        {ai.scriptures.map((w) => (
          <Panel key={w.reference} className="px-[18px] py-5">
            <h2 className="mb-3 font-display text-xl font-medium text-gilt-500">{w.reference}</h2>
            <ScriptureBlock>{w.text}</ScriptureBlock>
            <p className="mt-3.5 border-t border-ink-900/15 pt-3.5 font-body text-sm leading-[1.6] text-ink-900">
              {w.context}
            </p>
          </Panel>
        ))}
      </div>
      <div className="mt-4">
        <GiltButton fullWidth onClick={onContinue}>
          Continue to those who walked before
        </GiltButton>
      </div>
    </>
  );
}
