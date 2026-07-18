// The Daily Scale Archive — every question we've weighed. Search, scale cards,
// quiet pagination. The archive spends no gold until the footer CTA.
// (website.html Frame set C)

import type { Metadata } from 'next';
import Link from 'next/link';
import { BASE_URL } from '@/lib/seo';
import { Sec, CtaBand, PageHead, ScaleCard } from '@/components/site/Site';
import { listPastScales, ARCHIVE_PAGE_SIZE } from '@/lib/scales';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The Daily Scale Archive',
  description:
    "Every question we've weighed — real decisions argued from both sides, with the Scripture Lens that never declares a winner.",
  alternates: { canonical: `${BASE_URL}/scale` },
};

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const q = sp.q ?? '';
  const { scales, total } = await listPastScales(page, q);
  const pages = Math.max(1, Math.ceil(total / ARCHIVE_PAGE_SIZE));

  const pageHref = (p: number) =>
    `/scale?${new URLSearchParams({ ...(q ? { q } : {}), ...(p > 1 ? { page: String(p) } : {}) })}`;

  return (
    <>
      <PageHead
        eyebrow="The archive"
        title="The Daily Scale Archive"
        sub="Every question we've weighed."
      />
      <Sec pad="px-5 pb-[88px] pt-14 md:px-[5%]">
        <form action="/scale" method="get">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search every question — job, money, family…"
            aria-label="Search the archive"
            className="min-h-[48px] w-full rounded-panel border border-gilt-edge bg-nave-800 px-4 font-body text-[15px] text-vellum-100 placeholder:text-vellum-200/40 focus:outline-none focus:ring-2 focus:ring-gilt-500"
          />
        </form>

        {scales.length > 0 ? (
          <div className="mt-7 grid gap-4">
            {scales.map((s) => (
              <ScaleCard key={s.id} s={s} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center font-body text-sm text-vellum-200/60">
            {q
              ? `Nothing weighed under “${q}” yet. Try another word.`
              : 'The first scales are still being weighed. Come back tomorrow.'}
          </p>
        )}

        {pages > 1 && (
          <div className="mt-[30px] flex items-center justify-between">
            {page > 1 ? (
              <Link href={pageHref(page - 1)} className="font-body text-sm font-semibold text-gilt-300 hover:text-gilt-500">
                ← Previous
              </Link>
            ) : (
              <span className="font-body text-sm text-vellum-200/30">← Previous</span>
            )}
            <span className="font-body text-[13px] text-vellum-200/60">
              Page {page} of {pages}
            </span>
            {page < pages ? (
              <Link href={pageHref(page + 1)} className="font-body text-sm font-semibold text-gilt-300 hover:text-gilt-500">
                Next →
              </Link>
            ) : (
              <span className="font-body text-sm text-vellum-200/30">Next →</span>
            )}
          </div>
        )}
      </Sec>
      <CtaBand
        title="A new scale every morning — join free."
        micro="One question a day. Weigh it with the whole church."
      />
    </>
  );
}
