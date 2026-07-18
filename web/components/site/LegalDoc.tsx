// Quiet document layout: Playfair title, last-updated eyebrow, anchor list on
// vellum-200, prose sections, support line. (legal-system-states frames A/B)

import { Eyebrow, Panel } from '@/components/selah';

export function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-[26px] scroll-mt-24">
      <h2 className="font-display text-lg font-medium leading-[1.3] text-ink-900">{title}</h2>
      <div className="mt-2 grid gap-[9px] font-body text-[13.5px] leading-[1.65] text-ink-900">
        {children}
      </div>
    </section>
  );
}

export function LegalDoc({
  title,
  updated,
  anchors,
  intro,
  children,
}: {
  title: string;
  updated: string;
  anchors: [string, string][];
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[640px] px-4 pb-7 pt-6">
      <Panel className="px-6 pb-[30px] pt-[26px]">
        <Eyebrow on="vellum">Last updated · {updated}</Eyebrow>
        <h1 className="mt-3 font-display text-[27px] font-medium leading-[1.2] text-ink-900">
          {title}
        </h1>
        <nav className="mt-[18px] rounded-control bg-vellum-200 px-4 py-3.5">
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
            On this page
          </p>
          <div className="mt-2.5 grid gap-[7px]">
            {anchors.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="font-body text-[13px] font-semibold text-gilt-700 hover:underline">
                {label}
              </a>
            ))}
          </div>
        </nav>
        <p className="mt-[22px] font-body text-[13.5px] leading-[1.65] text-ink-900">{intro}</p>
        {children}
        <p className="mt-7 border-t border-ink-900/10 pt-4 font-body text-[12.5px] leading-[1.6] text-ink-500">
          Questions about this document? Write to{' '}
          <a href="mailto:legal@biblediscern.app" className="text-gilt-700 underline underline-offset-2">
            legal@biblediscern.app
          </a>
          .
        </p>
      </Panel>
    </div>
  );
}
