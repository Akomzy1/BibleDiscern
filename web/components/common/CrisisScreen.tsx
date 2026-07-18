'use client';

// Crisis Resources — the app's calmest surface and the deliberate exception to
// the navy-ground and one-gold rules: full vellum, ZERO decorative accents.
// Shown whenever crisis keywords are detected; the input is never sent to
// Claude. (legal-system-states.html Frame E)

import { useRouter } from 'next/navigation';

const RESOURCES: [string, string, string, 'phone' | 'message'][] = [
  ['988 Suicide & Crisis Lifeline', 'Call or text 988 — 24/7, free, confidential', 'tel:988', 'phone'],
  ['Crisis Text Line', 'Text HOME to 741741', 'sms:741741?&body=HOME', 'message'],
  ['RAINN', 'Call 1-800-656-4673', 'tel:18006564673', 'phone'],
];

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" />
    </svg>
  );
}

export function CrisisScreen() {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-vellum-100 text-ink-900">
      <main className="mx-auto flex min-h-full w-full max-w-[480px] flex-col justify-center px-6 pb-10 pt-safe">
        <h1 className="font-display text-[34px] font-medium leading-[1.15] text-ink-900">
          You matter.
        </h1>
        <p className="mt-3 font-body text-[15px] leading-[1.6] text-ink-900">
          If you&apos;re struggling right now, please reach a person who can help — today, this
          hour.
        </p>

        <div className="mt-[26px] grid gap-2.5">
          {RESOURCES.map(([name, action, href, icon]) => (
            <a
              key={name}
              href={href}
              className="flex min-h-[76px] items-center gap-4 rounded-panel border border-ink-900/15 bg-vellum-200 px-[18px] py-4 transition-colors duration-whisper ease-selah hover:bg-vellum-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900"
            >
              <span className="inline-flex flex-none text-ink-900">
                {icon === 'phone' ? <PhoneIcon /> : <MessageIcon />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-body text-base font-semibold leading-[1.3] text-ink-900">
                  {name}
                </span>
                <span className="mt-[3px] block font-body text-[13.5px] text-ink-500">{action}</span>
              </span>
            </a>
          ))}
        </div>

        <p className="mt-[22px] font-body text-[13px] leading-[1.6] text-ink-500">
          BibleDiscern is not a crisis service. If you&apos;re in immediate danger, call 911.
        </p>

        <div className="mt-[26px]">
          <button
            type="button"
            onClick={() => router.push('/today')}
            className="min-h-[50px] w-full rounded-control border border-ink-900/30 bg-transparent font-body text-[15px] font-semibold text-ink-900 transition-colors duration-whisper ease-selah hover:bg-ink-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900"
          >
            Return
          </button>
        </div>
      </main>
    </div>
  );
}
