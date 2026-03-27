import type { Metadata } from 'next';
import { BASE_URL, breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy — BibleDiscern',
  description: 'BibleDiscern privacy policy. We never sell your prayer data or spiritual journal. Your discernment sessions are private and encrypted.',
  alternates: { canonical: `${BASE_URL}/privacy` },
};

const LAST_UPDATED = 'March 1, 2026';

export default function PrivacyPage() {
  const crumbs = breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Privacy Policy', url: '/privacy' }]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <div className="bg-navy py-14 text-center">
        <h1 className="font-display text-4xl text-cream">Privacy Policy</h1>
        <p className="text-cream/50 mt-2 text-sm">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14 prose prose-lg text-text-dark">
        <p className="lead text-text-medium">
          BibleDiscern is built on a foundational commitment: your spiritual journey is private.
          We will never sell your prayers, decisions, or journal entries. We will never use
          your discernment sessions to train AI models.
        </p>

        <h2 className="font-display text-navy">1. Information We Collect</h2>
        <h3 className="text-navy">Account Information</h3>
        <p>When you create an account, we collect your email address, full name (optional), and display name (optional). This information is used to authenticate your account and personalize your experience.</p>

        <h3 className="text-navy">Discernment Sessions</h3>
        <p>When you use BibleDiscern's discernment feature, we store the situation you describe, your selected tone, and the AI-generated response (including scriptural guidance, narrative matches, examination questions, and prayer). This data is stored in your account and is accessible only to you.</p>

        <h3 className="text-navy">Journal Entries</h3>
        <p>Your Ebenezer stone entries, follow-up responses, and stillness notes are stored in your private journal. This data is accessible only to you.</p>

        <h3 className="text-navy">Usage Data</h3>
        <p>We collect anonymous, aggregated usage data (such as which features are used, session completion rates) to improve the app. This data does not contain any personally identifiable information or the content of your discernment sessions.</p>

        <h3 className="text-navy">Push Notification Token</h3>
        <p>If you enable push notifications, we store your device's push notification token to deliver daily moments and follow-up reminders. You can disable notifications at any time in the app settings.</p>

        <h2 className="font-display text-navy">2. How We Use Your Information</h2>
        <ul>
          <li>To provide and improve the BibleDiscern service</li>
          <li>To authenticate your account and maintain session security</li>
          <li>To deliver push notifications and follow-up reminders you have opted into</li>
          <li>To generate personalized AI responses to your discernment requests</li>
          <li>To send transactional emails (account confirmation, follow-up reminders)</li>
        </ul>

        <p><strong>We will never:</strong></p>
        <ul>
          <li>Sell your personal data or spiritual content to third parties</li>
          <li>Use the content of your discernment sessions to train AI models</li>
          <li>Share your prayer data, journal entries, or discernment sessions with any third party</li>
          <li>Send marketing emails without your explicit consent</li>
        </ul>

        <h2 className="font-display text-navy">3. Data Storage and Security</h2>
        <p>All data is stored in Supabase (PostgreSQL), hosted on AWS infrastructure. Row-level security policies ensure that each user can access only their own data. All data is encrypted in transit (TLS 1.3) and at rest (AES-256).</p>

        <h2 className="font-display text-navy">4. Third-Party Services</h2>
        <p>BibleDiscern uses the following third-party services:</p>
        <ul>
          <li><strong>Anthropic Claude API</strong> — to generate AI responses. Your discernment content is sent to Anthropic for processing. Anthropic's privacy policy applies to this processing. We have opted out of data usage for model training as permitted by Anthropic's terms.</li>
          <li><strong>Supabase</strong> — for database and authentication.</li>
          <li><strong>RevenueCat</strong> — for in-app subscription management on iOS and Android. RevenueCat receives anonymized transaction data.</li>
          <li><strong>Stripe</strong> — for web-based payment processing. Stripe receives payment information directly; we do not store payment card details.</li>
          <li><strong>Resend</strong> — for transactional email delivery.</li>
          <li><strong>Expo</strong> — for push notification delivery.</li>
        </ul>

        <h2 className="font-display text-navy">5. Data Retention</h2>
        <p>We retain your account data for as long as your account is active. If you delete your account, we will delete all associated data within 30 days, except where retention is required by applicable law.</p>

        <h2 className="font-display text-navy">6. Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
        <ul>
          <li>The right to access a copy of your data</li>
          <li>The right to correct inaccurate data</li>
          <li>The right to delete your data (right to erasure)</li>
          <li>The right to data portability</li>
          <li>The right to object to processing</li>
        </ul>
        <p>To exercise these rights, contact us at privacy@librato.ai.</p>

        <h2 className="font-display text-navy">7. Children's Privacy</h2>
        <p>BibleDiscern is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided personal information, contact us at privacy@librato.ai.</p>

        <h2 className="font-display text-navy">8. Changes to This Policy</h2>
        <p>We may update this privacy policy from time to time. When we make material changes, we will notify you through the app or by email. Your continued use of BibleDiscern after the changes take effect constitutes acceptance of the revised policy.</p>

        <h2 className="font-display text-navy">9. Contact</h2>
        <p>For privacy-related questions or concerns, contact us at: <a href="mailto:privacy@librato.ai" className="text-gold">privacy@librato.ai</a></p>
      </div>
    </>
  );
}
