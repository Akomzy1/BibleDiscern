// Crisis Resources — the app's calmest surface and the deliberate exception to
// the navy-ground and one-gold rules: full vellum, ZERO decorative accents.
// Shown whenever crisis keywords are detected; the input is never sent to
// Claude. (CLAUDE.md safety rules; Stage 8 frame refines visuals.)

import Link from 'next/link';
import { CRISIS_RESOURCES } from '@librato/shared';

export function CrisisScreen() {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-vellum-100">
      <main className="mx-auto flex min-h-full w-full max-w-[480px] flex-col justify-center px-6 py-12">
        <h1 className="font-display text-[26px] font-medium leading-[1.25] text-ink-900">
          You matter, and help is close.
        </h1>
        <p className="mt-4 font-body text-[15px] leading-relaxed text-ink-900">
          What you shared sounds heavier than a decision. Please reach out to someone who can be
          with you in it — right now, if you need them.
        </p>

        <div className="mt-8 grid gap-3">
          {CRISIS_RESOURCES.map((r) => (
            <a
              key={r.name}
              href={r.action}
              className="flex min-h-[56px] items-center justify-between rounded-panel border border-ink-900/15 bg-vellum-200 px-5 py-4 font-body transition-colors duration-whisper ease-selah hover:bg-vellum-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900"
            >
              <span className="text-[15px] font-semibold text-ink-900">{r.name}</span>
              <span className="text-sm text-ink-500">{r.type === 'call' ? 'Call' : 'Text'}</span>
            </a>
          ))}
        </div>

        <p className="mt-8 font-body text-[13px] leading-relaxed text-ink-500">
          BibleDiscern is not a crisis service. If you are in immediate danger, call 911.
        </p>
        <div className="mt-6">
          <Link
            href="/today"
            className="font-body text-sm font-semibold text-ink-900 underline underline-offset-4"
          >
            Return to Today
          </Link>
        </div>
      </main>
    </div>
  );
}
