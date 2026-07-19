'use client';

// Journey step 1 — The Crossroads (full-bleed journey shell, no tab bar).
// The journey is Premium-only: free users see the upgrade lock instead of the
// Crossroads form (server enforces the same gate in /api/discern).

import { useRouter } from 'next/navigation';
import { useJourney } from '@/hooks/useJourney';
import { useSubscription } from '@/hooks/useSubscription';
import { JourneyShell } from '@/components/journey/JourneyShell';
import { Crossroads } from '@/components/journey/Crossroads';
import { JourneyUpgradeLock } from '@/components/journey/JourneyLock';
import { CrisisScreen } from '@/components/common/CrisisScreen';
import { Beam } from '@/components/selah';

export default function NewJourneyPage() {
  const router = useRouter();
  const j = useJourney();
  const sub = useSubscription();

  if (j.status === 'crisis') return <CrisisScreen />;

  const back = () => router.push('/discern');

  if (sub.status === 'loading') {
    return (
      <JourneyShell step={1} onBack={back}>
        <div className="flex flex-1 flex-col items-center justify-center">
          <Beam sway />
        </div>
      </JourneyShell>
    );
  }

  // Pre-gate free users, and catch the server 'limit' response as a fallback.
  if (!sub.isPremium || j.status === 'limit') {
    return (
      <JourneyShell step={1} onBack={back}>
        <div className="flex flex-1 flex-col justify-center">
          <JourneyUpgradeLock />
        </div>
      </JourneyShell>
    );
  }

  return (
    <JourneyShell step={1} onBack={back}>
      <Crossroads j={j} />
    </JourneyShell>
  );
}
