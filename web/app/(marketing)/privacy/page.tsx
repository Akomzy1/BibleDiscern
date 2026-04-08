import type { Metadata } from 'next';
import { BASE_URL, breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy — BibleDiscern',
  description:
    'BibleDiscern privacy policy. We never sell your prayer data or spiritual journal. Your discernment sessions are private and encrypted.',
  alternates: { canonical: `${BASE_URL}/privacy` },
};

const LAST_UPDATED = 'April 2026';

export default function PrivacyPage() {
  const crumbs = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="bg-navy py-14 text-center px-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          {/* Cross icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="13" y="0" width="6" height="32" fill="#C8A45E" rx="3" />
            <rect x="0" y="10" width="32" height="6" fill="#C8A45E" rx="3" />
          </svg>
          <span className="font-display text-gold text-xl font-bold tracking-wide">BibleDiscern</span>
        </div>
        <h1 className="font-display text-4xl text-cream font-bold">Privacy Policy</h1>
        <p className="text-cream/50 mt-2 text-sm">Last updated: {LAST_UPDATED}</p>
      </div>

      {/* ── Commitment banner ─────────────────────────────────────── */}
      <div className="bg-gold/10 border-y border-gold/30 py-6 px-4">
        <p className="mx-auto max-w-3xl text-center text-navy font-medium leading-relaxed">
          BibleDiscern is built on one foundational promise: <strong>your spiritual journey is private.</strong>{' '}
          We will never sell your prayers, decisions, or journal entries.
          We will never use your discernment sessions to train AI models.
          We will never show you advertisements.
        </p>
      </div>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">

        {/* ── 1. Introduction ─────────────────────────────────────── */}
        <Section number="1" title="Introduction">
          <p>
            BibleDiscern ("<strong>the App</strong>", "<strong>we</strong>", "<strong>us</strong>", "<strong>our</strong>")
            is operated by <strong>AkomzyAi Consulting</strong>. This Privacy Policy explains what personal data
            we collect when you use BibleDiscern, how we use that data, who we share it with, how long we keep it,
            and what rights you have over it.
          </p>
          <p>
            By creating an account or using the App, you agree to the collection and use of information in accordance
            with this policy. If you do not agree, please do not use BibleDiscern.
          </p>
          <p>
            For questions about this policy, contact us at{' '}
            <a href="mailto:support@biblediscern.app" className="text-gold underline">
              support@biblediscern.app
            </a>
            .
          </p>
        </Section>

        {/* ── 2. Data We Collect ──────────────────────────────────── */}
        <Section number="2" title="Data We Collect">
          <SubHeading>Account Data</SubHeading>
          <p>
            When you create an account, we collect your <strong>email address</strong> (required),
            your <strong>name</strong> (optional), and your <strong>timezone</strong> (to schedule daily reminders
            at the right time). If you sign in with Google, we receive your email and display name from Google.
          </p>

          <SubHeading>Discernment Sessions</SubHeading>
          <p>
            When you use the discernment feature, we store the <strong>situation you describe</strong>,
            the tone you select, and the <strong>AI-generated response</strong> (including scriptural guidance,
            narrative matches, examination questions, stillness notes, fruit diagnostic, and prayer).
            This data is associated with your account and is accessible only to you.
          </p>

          <SubHeading>Journal Entries (Ebenezer Stones)</SubHeading>
          <p>
            Your personal reflections, follow-up journal responses, and Ebenezer stone entries are stored
            in your private journal. This content is visible only to you.
          </p>

          <SubHeading>Daily Scale Votes</SubHeading>
          <p>
            When you participate in The Daily Scale, we store which side you chose for each question.
            Your individual vote is private; only aggregated community percentages are displayed to other users.
          </p>

          <SubHeading>Subscription Data</SubHeading>
          <p>
            We store your subscription tier (Free or Premium), billing status, and subscription period.
            <strong> Payment details (card numbers, bank information) are handled entirely by Google Play
            or Apple App Store</strong> — we never see or store your payment credentials.
          </p>

          <SubHeading>Device and Notification Data</SubHeading>
          <p>
            If you enable push notifications, we store your device's <strong>push notification token</strong>
            to deliver Daily Scale reminders and follow-up prompts. We also store your device type (iOS or Android)
            to format notifications correctly. You can disable notifications at any time in the app settings.
          </p>

          <SubHeading>Usage Data (Anonymized)</SubHeading>
          <p>
            We collect anonymized, aggregated usage data — such as which features are used and session completion
            rates — to improve the App. This data does not contain personally identifiable information or the
            content of your discernment sessions and is never linked back to you as an individual.
          </p>
        </Section>

        {/* ── 3. How We Use Your Data ─────────────────────────────── */}
        <Section number="3" title="How We Use Your Data">
          <p>We use your data solely to provide and improve BibleDiscern:</p>
          <ul>
            <li>To authenticate your account and maintain session security</li>
            <li>To process your discernment requests via the Anthropic Claude API</li>
            <li>To save and display your spiritual journal and Ebenezer stones</li>
            <li>To track your subscription status and enforce feature access</li>
            <li>To deliver push notifications you have opted into (Daily Scale reminders, follow-up prompts)</li>
            <li>To send transactional emails (account confirmation, deletion confirmation)</li>
            <li>To display your community-level Daily Scale results</li>
            <li>To detect crisis language and display emergency resources locally on your device</li>
            <li>To improve the App through anonymized, aggregated analytics</li>
          </ul>

          <NeverBox />
        </Section>

        {/* ── 4. AI and Your Data ─────────────────────────────────── */}
        <Section number="4" title="AI and Your Data">
          <p>
            BibleDiscern uses the <strong>Anthropic Claude API</strong> to generate discernment responses.
            When you submit a discernment request, the situation you describe is sent to Anthropic's servers
            for processing.
          </p>
          <p>
            <strong>Important:</strong> Anthropic does not use API inputs or outputs to train its AI models,
            per their{' '}
            <a
              href="https://www.anthropic.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline"
            >
              Privacy Policy
            </a>{' '}
            and API usage terms. Your discernment content is processed and returned — it is not retained
            by Anthropic for training purposes.
          </p>
          <p>
            AI-generated responses are saved to your account so you can revisit them in your journal.
            No human at BibleDiscern or Anthropic reads your individual sessions.
          </p>
          <p>
            <strong>We will never use your prayers, decisions, or journal entries to train any AI model</strong>,
            including our own future models.
          </p>
        </Section>

        {/* ── 5. Data Storage and Security ────────────────────────── */}
        <Section number="5" title="Data Storage and Security">
          <p>
            Your data is stored in <strong>Supabase</strong> (PostgreSQL), hosted on AWS infrastructure.
            Row Level Security (RLS) policies enforce that each user can access only their own data —
            even at the database level.
          </p>
          <ul>
            <li><strong>Encryption in transit:</strong> all data transmitted between your device and our servers uses HTTPS/TLS 1.3</li>
            <li><strong>Encryption at rest:</strong> all data stored on Supabase is encrypted using AES-256</li>
            <li><strong>Authentication:</strong> via Supabase Auth using email/password or Google Sign In</li>
            <li><strong>Auth tokens:</strong> stored in your device's secure storage (expo-secure-store / iOS Keychain / Android Keystore)</li>
            <li><strong>Row Level Security:</strong> database policies prevent any user from querying another user's data</li>
          </ul>
          <p>
            While we implement industry-standard security measures, no method of transmission over the Internet
            or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </Section>

        {/* ── 6. Data Retention ───────────────────────────────────── */}
        <Section number="6" title="Data Retention">
          <p>
            We retain your personal data for as long as your account is active. Specifically:
          </p>
          <ul>
            <li>
              <strong>Active accounts:</strong> all data (sessions, journal, votes, profile) is retained
              indefinitely while your account exists
            </li>
            <li>
              <strong>Deleted accounts:</strong> when you delete your account via{' '}
              <a href="/delete-account" className="text-gold underline">biblediscern.app/delete-account</a>,
              all your data is permanently and irreversibly removed from our systems
            </li>
            <li>
              <strong>Backup retention:</strong> database backups are retained for up to 30 days.
              After account deletion, your data will be purged from all backups within 30 days.
            </li>
            <li>
              <strong>No partial retention:</strong> we do not retain any portion of your data after deletion,
              including anonymized fragments of your discernment sessions or journal entries
            </li>
          </ul>
        </Section>

        {/* ── 7. Third-Party Services ─────────────────────────────── */}
        <Section number="7" title="Third-Party Services">
          <p>
            BibleDiscern relies on the following third-party services. Each has its own privacy policy
            governing its use of your data:
          </p>
          <table className="w-full text-sm mt-4 mb-2 border-collapse">
            <thead>
              <tr className="bg-navy text-cream">
                <th className="text-left px-4 py-3 rounded-tl-lg">Service</th>
                <th className="text-left px-4 py-3">Purpose</th>
                <th className="text-left px-4 py-3 rounded-tr-lg">Privacy Policy</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Supabase', 'Database, auth, file storage', 'supabase.com/privacy'],
                ['Anthropic Claude API', 'AI discernment processing', 'anthropic.com/privacy'],
                ['RevenueCat', 'In-app subscription management', 'revenuecat.com/privacy'],
                ['Google Play', 'Android payments & distribution', 'policies.google.com/privacy'],
                ['Apple App Store', 'iOS payments & distribution', 'apple.com/legal/privacy'],
                ['Resend', 'Transactional email delivery', 'resend.com/privacy'],
                ['Expo (EAS)', 'Push notifications & builds', 'expo.dev/privacy'],
              ].map(([service, purpose, policy], i) => (
                <tr key={service} className={i % 2 === 0 ? 'bg-cream' : 'bg-parchment'}>
                  <td className="px-4 py-3 font-semibold text-navy">{service}</td>
                  <td className="px-4 py-3 text-text-dark">{purpose}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://${policy}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold underline break-all"
                    >
                      {policy}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm text-text-medium mt-3">
            We only share the minimum data necessary for each service to function.
            We do not sell data to any of these providers for advertising purposes.
          </p>
        </Section>

        {/* ── 8. Children's Privacy ───────────────────────────────── */}
        <Section number="8" title="Children's Privacy">
          <p>
            BibleDiscern is not intended for children under the age of 13. We do not knowingly collect
            personal information from children under 13. If you are a parent or guardian and believe
            your child has provided us with personal information, please contact us immediately at{' '}
            <a href="mailto:support@biblediscern.app" className="text-gold underline">
              support@biblediscern.app
            </a>{' '}
            and we will delete that information promptly.
          </p>
          <p>
            If you are between 13 and 18 years of age, please ensure you have your parent or guardian's
            permission before using BibleDiscern.
          </p>
        </Section>

        {/* ── 9. Your Rights ──────────────────────────────────────── */}
        <Section number="9" title="Your Rights">
          <p>
            Depending on your jurisdiction (including GDPR for EEA residents and CCPA for California residents),
            you may have the following rights:
          </p>
          <ul>
            <li>
              <strong>Access:</strong> request a copy of the personal data we hold about you by emailing{' '}
              <a href="mailto:support@biblediscern.app" className="text-gold underline">support@biblediscern.app</a>
            </li>
            <li>
              <strong>Deletion:</strong> delete your account and all associated data at{' '}
              <a href="/delete-account" className="text-gold underline">biblediscern.app/delete-account</a>
            </li>
            <li>
              <strong>Correction:</strong> update your name, email, and timezone in the app's Settings screen
            </li>
            <li>
              <strong>Portability:</strong> request an export of your data by emailing{' '}
              <a href="mailto:support@biblediscern.app" className="text-gold underline">support@biblediscern.app</a>
            </li>
            <li>
              <strong>Objection:</strong> object to specific processing of your data by contacting us directly
            </li>
            <li>
              <strong>Withdraw consent:</strong> disable push notifications at any time in the app settings
            </li>
          </ul>
          <p>
            We will respond to all data rights requests within 30 days. We may need to verify your identity
            before fulfilling a request.
          </p>
        </Section>

        {/* ── 10. Crisis Detection ────────────────────────────────── */}
        <Section number="10" title="Crisis Detection Disclaimer">
          <p>
            BibleDiscern includes a local crisis keyword detection feature. If language suggesting a mental
            health emergency is detected in your discernment input, the App displays crisis resources directly
            on your device — including the 988 Suicide and Crisis Lifeline and the Crisis Text Line.
          </p>
          <p>
            <strong>No data is shared with crisis services.</strong> Detection happens locally within the app.
            We do not transmit your content to any crisis organization, and crisis resources are shown
            as a precautionary measure only.
          </p>
          <p>
            If you or someone you know is in crisis, please contact emergency services or call/text 988 (US).
          </p>
        </Section>

        {/* ── 11. Changes ─────────────────────────────────────────── */}
        <Section number="11" title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices,
            technology, legal requirements, or other factors. When we make material changes, we will:
          </p>
          <ul>
            <li>Update the "Last updated" date at the top of this page</li>
            <li>Notify you via push notification or email where required by law</li>
          </ul>
          <p>
            Your continued use of BibleDiscern after the revised policy takes effect constitutes your
            acceptance of the changes. If you do not agree with the updated policy, please delete your
            account and stop using the App.
          </p>
        </Section>

        {/* ── 12. Contact ─────────────────────────────────────────── */}
        <Section number="12" title="Contact Us">
          <p>For privacy-related questions, data requests, or concerns, contact us at:</p>
          <div className="mt-4 p-5 bg-navy/5 border border-navy/10 rounded-xl">
            <p className="font-semibold text-navy mb-1">AkomzyAi Consulting</p>
            <p className="text-text-dark">
              Email:{' '}
              <a href="mailto:support@biblediscern.app" className="text-gold underline">
                support@biblediscern.app
              </a>
            </p>
            <p className="text-text-dark mt-1">
              Account deletion:{' '}
              <a href="/delete-account" className="text-gold underline">
                biblediscern.app/delete-account
              </a>
            </p>
          </div>
        </Section>

      </div>
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="font-display text-navy text-2xl font-bold mb-5 pb-3 border-b border-gold/30">
        {number}. {title}
      </h2>
      <div className="prose prose-lg max-w-none text-text-dark [&_p]:mb-4 [&_ul]:mb-4 [&_li]:mb-2 [&_a]:text-gold [&_strong]:text-navy">
        {children}
      </div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-navy text-lg font-semibold mt-6 mb-2">{children}</h3>
  );
}

function NeverBox() {
  return (
    <div className="mt-6 p-5 bg-navy rounded-xl">
      <p className="text-gold font-bold font-display mb-3">We will NEVER:</p>
      <ul className="space-y-2">
        {[
          'Sell your personal data or spiritual content to third parties',
          'Use the content of your discernment sessions, prayers, or journal to train any AI model',
          'Show you advertisements or use your data for ad targeting',
          'Share your prayer data, journal entries, or discernment sessions with any third party',
          'Send marketing emails without your explicit consent',
          'Read your individual discernment sessions or journal entries',
        ].map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="text-gold font-bold mt-0.5 flex-shrink-0">✕</span>
            <span className="text-cream/90 text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
