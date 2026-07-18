// Terms of Service — the v2 quiet document layout with the frame's copy.
// (legal-system-states.html Frame B)

import type { Metadata } from 'next';
import { BASE_URL } from '@/lib/seo';
import { LegalDoc, DocSection } from '@/components/site/LegalDoc';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'BibleDiscern terms of service — short on purpose. What BibleDiscern is, your account, billing, acceptable use, and how to leave.',
  alternates: { canonical: `${BASE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      updated="July 1, 2026"
      anchors={[
        ['t1', 'What BibleDiscern is'],
        ['t2', 'Your account'],
        ['t3', 'Free trial and billing'],
        ['t4', 'Acceptable use'],
        ['t5', 'Ending your account'],
        ['t6', 'Changes to these terms'],
      ]}
      intro="By creating an account you agree to these terms. They are short on purpose; read them."
    >
      <DocSection id="t1" title="What BibleDiscern is">
        <p>
          BibleDiscern offers Scripture for reflection, not a verdict. It is a guided practice, not
          medical, legal, financial, or pastoral counsel. The decisions you weigh — and their
          outcomes — remain yours, before God.
        </p>
        <p>
          If you are in crisis, BibleDiscern is not a crisis service. Crisis resources are listed
          in the app and available without an account.
        </p>
      </DocSection>
      <DocSection id="t2" title="Your account">
        <p>
          You must be 13 or older. Keep your password to yourself; you are responsible for activity
          under your account. One account per person.
        </p>
      </DocSection>
      <DocSection id="t3" title="Free trial and billing">
        <p>
          Premium is free for 7 days. Cancel anytime during the trial and you will not be charged.
          Subscriptions renew automatically — $49.99/year or $7.99/month — until you cancel.
        </p>
        <p>
          Purchases made through an app store are billed and refunded by that store, under its
          terms.
        </p>
      </DocSection>
      <DocSection id="t4" title="Acceptable use">
        <p>
          Do not attempt to access another person&apos;s journal, disrupt the service, or scrape
          community data. Daily Scale questions and community results are for your personal
          reflection, not republication.
        </p>
      </DocSection>
      <DocSection id="t5" title="Ending your account">
        <p>
          You may delete your account at any time from Settings; deletion is permanent. We may
          close accounts that violate these terms, with notice and a chance to export your journal
          where the law allows.
        </p>
      </DocSection>
      <DocSection id="t6" title="Changes to these terms">
        <p>
          If these terms change in a way that matters, we will tell you in the app at least 30 days
          before the change takes effect. Continued use after that date is acceptance.
        </p>
      </DocSection>
    </LegalDoc>
  );
}
