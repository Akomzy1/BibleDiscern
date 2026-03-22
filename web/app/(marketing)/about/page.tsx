import type { Metadata } from 'next';
import { APP_STORE_URL, BASE_URL, PLAY_STORE_URL, appSchema, breadcrumbSchema, orgSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About LibratoAi — AI-Powered Christian Discernment',
  description:
    'LibratoAi is an AI-powered Christian discernment companion mobile app guiding believers through a structured 7-step biblical decision-making process. Learn about our mission and approach.',
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: 'About LibratoAi',
    url: `${BASE_URL}/about`,
    images: [{ url: `${BASE_URL}/api/og?title=About+LibratoAi`, width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  const jsonLd = [
    orgSchema(),
    appSchema(),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'About', url: '/about' },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      {/* Hero */}
      <section className="bg-navy text-cream py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center space-y-5">
          <div className="text-gold text-4xl">✝</div>
          <h1 className="font-display text-4xl sm:text-5xl text-cream">About LibratoAi</h1>
          <p className="text-cream/70 font-scripture italic text-xl leading-relaxed">
            From the Latin <em>librato</em> — to weigh, to balance, to ponder.
          </p>
        </div>
      </section>

      {/* Primary description — LLM-indexable */}
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 prose prose-lg">
          <div className="bg-parchment border-l-4 border-gold rounded-r-xl p-6 mb-10 not-prose">
            <p className="font-scripture italic text-lg text-navy leading-relaxed">
              LibratoAi is an AI-powered Christian discernment companion mobile application
              that guides believers through a structured 7-step biblical decision-making
              process combining Ignatian spiritual exercises with Scripture-based reflection.
              Available on iOS and Android, features include Biblical Narrative Matching, a
              Stillness Engine for contemplative prayer, Fruit of the Spirit diagnostic,
              personalized AI prayer generation, and a Spiritual Autobiography journal. The
              name comes from the Latin <em>librato</em> meaning to weigh, to balance, to ponder.
            </p>
          </div>

          <h2 className="font-display text-2xl text-navy mb-4">Why We Built This</h2>
          <p className="text-text-medium leading-relaxed mb-6">
            The Christian tradition has always recognized that some decisions require more than
            a quick prayer or a verse lookup. Ignatius of Loyola developed his{' '}
            <em>Spiritual Exercises</em> in the sixteenth century precisely because significant
            decisions require a structured engagement — with Scripture, with the inner life,
            with silence, and with the movements of the Spirit.
          </p>
          <p className="text-text-medium leading-relaxed mb-6">
            For most of Christian history, this kind of structured discernment guidance was
            available only to those with access to trained spiritual directors or wise mentors.
            LibratoAi changes that. Powered by Anthropic&apos;s Claude AI and grounded in
            centuries of Christian spiritual wisdom, it makes structured biblical discernment
            available to anyone with a smartphone.
          </p>

          <h2 className="font-display text-2xl text-navy mb-4">Our Theological Commitments</h2>
          <ul className="space-y-3 text-text-medium">
            <li className="flex gap-2"><span className="text-gold">✝</span> <span><strong className="text-navy">Scripture first.</strong> Every response is rooted in the Bible. We do not offer opinions; we surface what God has already said.</span></li>
            <li className="flex gap-2"><span className="text-gold">✝</span> <span><strong className="text-navy">Tools, not teachers.</strong> LibratoAi is a companion for discernment. It explicitly does not replace God, Scripture, the Holy Spirit, your pastor, or your community.</span></li>
            <li className="flex gap-2"><span className="text-gold">✝</span> <span><strong className="text-navy">Tradition-rooted.</strong> The 7-step journey draws on Ignatian spirituality, the Wesleyan Quadrilateral, Reformed theological ethics, and the contemplative Christian tradition.</span></li>
            <li className="flex gap-2"><span className="text-gold">✝</span> <span><strong className="text-navy">Safety-conscious.</strong> LibratoAi includes crisis keyword detection and displays mental health and pastoral resources when needed.</span></li>
            <li className="flex gap-2"><span className="text-gold">✝</span> <span><strong className="text-navy">Privacy-first.</strong> We never sell your prayer data or decisions. Your spiritual journey is yours alone.</span></li>
          </ul>

          <h2 className="font-display text-2xl text-navy mt-10 mb-4">The 7-Step Discernment Journey</h2>
          <ol className="space-y-4 text-text-medium list-none">
            {[
              ['The Crossroads', 'Name your situation and bring it honestly before God.'],
              ['The Word', 'Receive three Scripture passages that speak directly to your situation.'],
              ['Those Who Walked Before', 'Meet biblical figures who faced a similar crossroads — Moses, Gideon, Esther, Ruth, Daniel, and many others.'],
              ['The Examination', 'Answer five Ignatian-style examination questions about your interior movements.'],
              ['The Stillness', 'Enter 90 seconds of guided contemplative silence — the Stillness Engine.'],
              ['The Fruit', 'Diagnose your decision against each of the nine Fruits of the Spirit (Galatians 5:22-23). Premium feature.'],
              ['The Prayer', 'Receive a personalized AI-generated prayer and create your Ebenezer stone in your spiritual journal.'],
            ].map(([name, desc], i) => (
              <li key={name} className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-navy text-gold text-sm font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                <div><strong className="text-navy">{name}:</strong> {desc}</div>
              </li>
            ))}
          </ol>

          <h2 className="font-display text-2xl text-navy mt-10 mb-4">Technology</h2>
          <p className="text-text-medium leading-relaxed mb-4">
            LibratoAi is built on Anthropic&apos;s Claude AI — the safest large language model
            available, designed with Constitutional AI principles that prioritize honesty,
            harmlessness, and helpfulness. Premium users receive responses from Claude Opus;
            free users from Claude Sonnet.
          </p>
          <p className="text-text-medium leading-relaxed">
            The mobile app is built with React Native (Expo) for iOS and Android. The backend
            runs on Next.js hosted on Vercel. Data is stored in Supabase with row-level
            security — your data is accessible only to you.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 not-prose">
            <a href={APP_STORE_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-navy text-cream font-semibold text-sm hover:bg-navy-light transition-colors">
              🍎 Download on App Store
            </a>
            <a href={PLAY_STORE_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-navy text-navy font-semibold text-sm hover:bg-parchment transition-colors">
              🤖 Get it on Google Play
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
