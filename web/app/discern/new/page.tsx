'use client';

// Journey step 1 — The Crossroads (full-bleed journey shell, no tab bar).

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useJourney } from '@/hooks/useJourney';
import { JourneyShell } from '@/components/journey/JourneyShell';
import { Crossroads } from '@/components/journey/Crossroads';
import { CrisisScreen } from '@/components/common/CrisisScreen';
import { GiltButton, Panel } from '@/components/selah';
import { TRIAL_LINE } from '@librato/shared';

export default function NewJourneyPage() {
  const router = useRouter();
  const j = useJourney();

  if (j.status === 'crisis') return <CrisisScreen />;

  if (j.status === 'limit') {
    return (
      <JourneyShell step={1} onBack={() => router.push('/discern')}>
        <div className="flex flex-1 flex-col justify-center">
          <Panel className="p-6 text-center">
            <h2 className="font-display text-xl font-medium text-ink-900">
              You&apos;ve used your free journey this month
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink-500">
              Premium opens unlimited discernment journeys — every decision, every day.
            </p>
            <div className="mt-5">
              <Link href="/upgrade">
                <GiltButton fullWidth>Start my 7-day free trial</GiltButton>
              </Link>
            </div>
            <p className="mt-3 font-body text-xs text-ink-500">{TRIAL_LINE}</p>
          </Panel>
        </div>
      </JourneyShell>
    );
  }

  return (
    <JourneyShell step={1} onBack={() => router.push('/discern')}>
      <Crossroads j={j} />
    </JourneyShell>
  );
}
