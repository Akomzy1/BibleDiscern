'use client';

import Link from 'next/link';
import { useDailyScale } from '@/hooks/useDailyScale';
import { DailyScale } from '@/components/scale/DailyScale';
import { InstallCard } from '@/components/common/InstallCard';
import { Beam, Eyebrow, GiltButton, Panel } from '@/components/selah';

function QuietState({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow: string;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="pt-10 text-center">
      <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
      <Beam className="my-4" />
      <Panel tone="navy" className="mx-auto max-w-sm p-6">
        <h1 className="font-display text-xl text-vellum-100">{title}</h1>
        <p className="mt-2 font-body text-sm leading-relaxed text-vellum-200/80">{body}</p>
        {action && <div className="mt-5">{action}</div>}
      </Panel>
    </div>
  );
}

export default function TodayPage() {
  const s = useDailyScale();

  if (s.status === 'loading') {
    return (
      <main aria-busy>
        <div className="mt-2.5 text-center">
          <Eyebrow className="justify-center">Today&apos;s Daily Scale</Eyebrow>
        </div>
        <Beam sway className="my-6" />
        <Panel tone="navy" className="h-64 animate-pulse p-5" aria-hidden>
          <div className="h-full" />
        </Panel>
      </main>
    );
  }

  if (s.status === 'unauthenticated') {
    return (
      <main>
        <QuietState
          eyebrow="BibleDiscern"
          title="Weigh it with wisdom"
          body="Sign in to weigh today's scale alongside the community."
          action={
            <Link href="/login">
              <GiltButton fullWidth>Sign in</GiltButton>
            </Link>
          }
        />
      </main>
    );
  }

  if (s.status === 'offline') {
    return (
      <main>
        <QuietState
          eyebrow="You're offline"
          title="The Word doesn't need a signal"
          body="— but this app does for new content. Today's scale will be waiting when you're back."
          action={
            <GiltButton variant="secondary" fullWidth onClick={() => void s.reload()}>
              Try again
            </GiltButton>
          }
        />
      </main>
    );
  }

  if (s.status === 'error') {
    return (
      <main>
        <QuietState
          eyebrow="Today's Daily Scale"
          title="We couldn't reach the server"
          body="Your words are saved — try again in a moment."
          action={
            <GiltButton variant="secondary" fullWidth onClick={() => void s.reload()}>
              Try again
            </GiltButton>
          }
        />
      </main>
    );
  }

  return (
    <main>
      <DailyScale s={s} />
      {/* Install affordance — only after the day's scale is weighed (high intent) */}
      {(s.phase === 'learn' || s.phase === 'completed') && <InstallCard className="mt-6" />}
    </main>
  );
}
