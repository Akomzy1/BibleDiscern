// Scale detail — one past scale read in full: both argument cards, the final
// result bars (1.5s reveal), and the Scripture Lens (drop cap, teaching,
// prayer — it never declares a winner). Per-page metadata + OG + JSON-LD.
// (website.html Frame set D)

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BASE_URL } from '@/lib/seo';
import { Eyebrow, Panel, PrayerCard, ScriptureBlock, VellumGrain } from '@/components/selah';
import { Sec, SiteH2, CtaBand, PageHead, ScaleCard } from '@/components/site/Site';
import { ResultBars } from '@/components/scale/ResultBars';
import { getScaleBySlug, getRelatedScales, computePercents, scaleDate } from '@/lib/scales';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const scale = await getScaleBySlug(slug);
  if (!scale) return { title: 'The Daily Scale' };
  const description = `${scale.side_a_label} — or ${scale.side_b_label}? How believers weighed it, and the Scripture Lens from ${scale.scripture_reference ?? 'the Word'}.`;
  const url = `${BASE_URL}/scale/${slug}`;
  return {
    title: scale.question,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: scale.question,
      description,
      url,
      type: 'article',
      images: [
        {
          url: `${BASE_URL}/api/og?title=${encodeURIComponent(scale.question)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

function ArgCard({ id, title, body }: { id: 'A' | 'B'; title: string; body: string }) {
  return (
    <Panel className="px-6 py-[22px]">
      <div className="mb-2 flex items-center gap-3">
        <span
          className={`inline-flex h-7 w-7 flex-none items-center justify-center rounded-pill font-display text-sm font-medium ${
            id === 'A' ? 'bg-nave-800 text-vellum-100' : 'bg-gilt-500 text-nave-900'
          }`}
        >
          {id}
        </span>
        <b className="font-body text-[17px] text-ink-900">{title}</b>
      </div>
      <p className="font-body text-[15.5px] leading-[1.6] text-ink-500">{body}</p>
    </Panel>
  );
}

export default async function ScaleDetailPage({ params }: Params) {
  const { slug } = await params;
  const scale = await getScaleBySlug(slug);
  if (!scale) notFound();

  const p = computePercents(scale);
  const related = await getRelatedScales(scale.id, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: scale.question,
    datePublished: scale.date,
    url: `${BASE_URL}/scale/${slug}`,
    publisher: { '@type': 'Organization', name: 'BibleDiscern', url: BASE_URL },
    about: scale.scripture_reference ?? undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHead scripture eyebrow={`The Daily Scale · ${scaleDate(scale.date)}`} title={scale.question} />

      <Sec pad="px-5 pt-14 md:px-[5%]">
        <div className="grid gap-4">
          <ArgCard id="A" title={scale.side_a_label} body={scale.side_a_argument} />
          <ArgCard id="B" title={scale.side_b_label} body={scale.side_b_argument} />
        </div>
        <Panel className="mt-4 px-6 py-[26px] md:px-7">
          <Eyebrow on="vellum" className="mb-4">
            How believers weighed it
          </Eyebrow>
          <ResultBars
            sideALabel={scale.side_a_label}
            sideBLabel={scale.side_b_label}
            percentA={p.a}
            percentB={p.b}
          />
          <p className="mt-4 text-center font-body text-[13px] text-ink-500">
            {p.total.toLocaleString('en-US')} believers weighed in
          </p>
        </Panel>
      </Sec>

      <Sec pad="px-5 pb-[88px] pt-16 md:px-[5%]">
        <div className="grid justify-items-center gap-[18px]">
          <Eyebrow>The Scripture Lens</Eyebrow>
          <Panel className="w-full px-7 py-[30px] md:px-8">
            <div className="relative overflow-hidden rounded-control bg-vellum-200 px-6 py-[22px]">
              <VellumGrain />
              <div className="relative">
                <ScriptureBlock>{scale.scripture_text ?? ''}</ScriptureBlock>
                <p className="mt-2 font-body text-sm text-ink-500">— {scale.scripture_reference}</p>
              </div>
            </div>
            <p className="mx-0.5 mt-[18px] font-body text-[15.5px] leading-[1.65] text-ink-900">
              {scale.scripture_lens}
            </p>
            <PrayerCard className="mt-[18px]">{scale.prayer}</PrayerCard>
          </Panel>
          <p className="font-scripture text-[15px] italic text-vellum-200/60">
            The Lens holds up the Word. It never declares a winner.
          </p>
        </div>
      </Sec>

      <CtaBand
        title="Today's scale is live — weigh in free."
        cta="Weigh in — free"
        micro="A new question every morning."
      />

      {related.length > 0 && (
        <section className="border-t border-gilt-edge bg-nave-900 px-5 pb-[88px] pt-[72px] md:px-[5%]">
          <div className="mx-auto max-w-[1040px]">
            <SiteH2 className="mb-7 text-center !text-[28px]">Weighed nearby</SiteH2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <ScaleCard key={r.id} s={r} compact />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
