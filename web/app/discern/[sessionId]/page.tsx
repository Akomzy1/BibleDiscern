'use client';

// Journey steps 2–7 for an existing session. State survives refresh via
// sessionStorage + server (useJourney).

import { use } from 'react';
import { useJourney } from '@/hooks/useJourney';
import { JourneyShell } from '@/components/journey/JourneyShell';
import { StepWord } from '@/components/journey/StepWord';
import { StepWalked } from '@/components/journey/StepWalked';
import { StepExamination } from '@/components/journey/StepExamination';
import { StepFruit, StepFruitLocked } from '@/components/journey/StepFruit';
import { Stillness, StillnessLocked } from '@/components/journey/Stillness';
import { StepPrayer } from '@/components/journey/StepPrayer';
import { Beam, GiltButton, Panel } from '@/components/selah';
import { useSubscription } from '@/hooks/useSubscription';

export default function JourneyPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const j = useJourney(sessionId);
  const sub = useSubscription();

  if (j.status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-nave-900">
        <Beam sway />
        <p className="mt-4 font-body text-sm text-vellum-200/60">Gathering your journey…</p>
      </div>
    );
  }

  if (j.status === 'error' || !j.ai) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-nave-900 px-6">
        <Panel tone="navy" className="w-full max-w-sm p-6 text-center">
          <p className="font-body text-sm leading-relaxed text-vellum-200/80">
            {j.errorMessage ??
              "We couldn't reach the server. Your words are saved — try again in a moment."}
          </p>
          <div className="mt-5">
            <GiltButton variant="secondary" fullWidth onClick={() => window.location.reload()}>
              Try again
            </GiltButton>
          </div>
        </Panel>
      </div>
    );
  }

  // The Stillness is its own full-bleed screen — no journey chrome.
  // Premium-only: a free user (e.g. on a journey begun before this gate) sees
  // the locked variant and may continue to the Prayer.
  if (j.step === 6) {
    if (!sub.isPremium) {
      return (
        <StillnessLocked
          busy={sub.busy}
          onStartTrial={() => void j.startCheckout('annual')}
          onSkip={() => j.goToStep(7)}
        />
      );
    }
    return (
      <Stillness
        onFinished={(note) => {
          void j.saveStillnessNote(note);
          j.goToStep(7);
        }}
      />
    );
  }

  return (
    <JourneyShell step={j.step} onBack={j.back}>
      {j.step === 2 && <StepWord ai={j.ai} onContinue={() => j.goToStep(3)} />}
      {j.step === 3 && <StepWalked ai={j.ai} onContinue={() => j.goToStep(4)} />}
      {j.step === 4 && <StepExamination ai={j.ai} j={j} onContinue={() => j.goToStep(5)} />}
      {j.step === 5 &&
        (j.hasFruitAccess ? (
          <StepFruit ai={j.ai} onContinue={() => j.goToStep(6)} />
        ) : (
          <StepFruitLocked
            ai={j.ai}
            busy={sub.busy}
            onStartTrial={() => void j.startCheckout('annual')}
            onSkip={() => j.goToStep(6)}
          />
        ))}
      {j.step === 7 && <StepPrayer ai={j.ai} j={j} />}
    </JourneyShell>
  );
}
