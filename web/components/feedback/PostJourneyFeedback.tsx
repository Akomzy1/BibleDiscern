'use client';

// The quiet post-journey micro-prompt (source='post_journey'), shown at most
// once per 3 completed journeys. A warm vellum card on the reverent navy ground.
// Never blocks the journal save — the save already happened before this appears.

import { Panel } from '@/components/selah';
import { FeedbackForm } from './FeedbackForm';

export function PostJourneyFeedback({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-nave-950">
      <div className="pt-safe" />
      <div className="flex flex-1 flex-col justify-center px-7">
        <h1 className="text-center font-display text-[27px] font-medium leading-tight text-vellum-100">
          How was that?
        </h1>
        <p className="mx-4 mt-2.5 text-center font-scripture text-[15px] font-medium italic leading-snug text-vellum-200/60">
          Your honest word shapes what we build.
        </p>
        <div className="mt-7">
          <Panel className="p-5">
            <FeedbackForm source="post_journey" onDone={onDone} onSkip={onDone} />
          </Panel>
        </div>
      </div>
      <div className="flex-[0.6]" />
    </div>
  );
}
