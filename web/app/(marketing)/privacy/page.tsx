// Privacy Policy — the v2 quiet document layout with the frame's plain-spoken
// copy. (legal-system-states.html Frame A)

import type { Metadata } from 'next';
import Link from 'next/link';
import { BASE_URL } from '@/lib/seo';
import { LegalDoc, DocSection } from '@/components/site/LegalDoc';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'BibleDiscern privacy policy. We never sell your data, never show advertising, and never read, analyze, or train on what you write.',
  alternates: { canonical: `${BASE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated="July 1, 2026"
      anchors={[
        ['p1', 'What we collect'],
        ['p2', 'Your journal'],
        ['p3', 'Community scale data'],
        ['p4', 'What we never do'],
        ['p5', 'Your rights'],
        ['p6', 'Deleting your data'],
      ]}
      intro="BibleDiscern exists so you can bring real decisions before God. That only works if what you bring stays private. This policy says, plainly, what we keep and what we will never do with it."
    >
      <DocSection id="p1" title="What we collect">
        <p>
          Your email address and password (or Google sign-in), the time you chose for your Daily
          Scale, and your subscription status.
        </p>
        <p>
          What you write: your discernment journeys, journal entries, Ebenezer Stones, and saved
          prayers. Your daily votes on the Scale.
        </p>
      </DocSection>
      <DocSection id="p2" title="Your journal">
        <p>
          Your journey is private — between you and the Lord. Everything you write is encrypted in
          transit and at rest. We do not read it, analyze it, or use it to train any model.
        </p>
      </DocSection>
      <DocSection id="p3" title="Community scale data">
        <p>
          When you weigh in on the Daily Scale, your vote joins the community result as a
          percentage. It is never shown with your name, and individual votes are not visible to
          anyone — including us, in ordinary operation.
        </p>
      </DocSection>
      <DocSection id="p4" title="What we never do">
        <p>
          We do not sell your data. We do not show advertising. We do not share what you write with
          churches, employers, family members, or anyone else. There are no exceptions for
          &ldquo;partners.&rdquo;
        </p>
      </DocSection>
      <DocSection id="p5" title="Your rights">
        <p>
          You can export everything you&apos;ve written, correct your account details, or delete
          your account entirely, at any time. Requests are honored within 30 days; most complete
          within 24 hours.
        </p>
      </DocSection>
      <DocSection id="p6" title="Deleting your data">
        <p>
          Account deletion removes your journeys, journal, prayers, votes, profile, and
          subscription records from our systems permanently. See{' '}
          <Link href="/delete-account" className="text-gilt-700 underline underline-offset-2">
            Delete your account
          </Link>{' '}
          in Settings.
        </p>
      </DocSection>
    </LegalDoc>
  );
}
