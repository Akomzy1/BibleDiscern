'use client';

// Delete account (public) — branded header, exact removal list, warning line,
// email field + ember-outlined button (the one screen where emphasis is NOT
// gold), sent state, support line. Wires POST /api/delete-account
// (confirmation email -> signed-token deletion). (Frame C / C2)

import { useState } from 'react';
import { CrossGlyph, Eyebrow, Panel, TextField } from '@/components/selah';

const REMOVED = [
  'Discernment journeys and sessions',
  'Journal entries and Ebenezer Stones',
  'Saved prayers',
  'Daily Scale votes',
  'Profile and account details',
  'Subscription and billing records',
];

export default function DeleteAccountPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        setError(body?.message ?? "We couldn't send the confirmation. Try again in a moment.");
        return;
      }
      setSent(true);
    } catch {
      setError("We couldn't reach the server. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[85vh] w-full max-w-[480px] flex-col px-6 pb-7 pt-8">
      <div className="text-center">
        <CrossGlyph size={22} muted />
        <h1 className="mt-3 font-display text-2xl font-medium leading-[1.25] text-vellum-100">
          Delete your account
        </h1>
        <p className="mt-2 font-scripture text-[17px] font-medium italic leading-[1.45] text-vellum-200/60">
          We&apos;re sorry to see you go.
        </p>
      </div>

      {!sent ? (
        <>
          <Panel className="mt-6 p-5">
            <Eyebrow on="vellum">What will be removed</Eyebrow>
            <div className="mt-3.5 grid gap-[9px]">
              {REMOVED.map((item) => (
                <div key={item} className="flex items-center gap-[11px] font-body text-sm leading-[1.4] text-ink-900">
                  <span className="inline-flex flex-none text-ink-500" aria-hidden>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M5 12h14" />
                    </svg>
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-ink-900/10 pt-3.5 font-body text-[13px] leading-[1.55] text-ember-600">
              This action cannot be undone. Your spiritual journal and all Ebenezer stones will be
              permanently deleted.
            </p>
          </Panel>
          <Panel className="mt-3 p-[18px]">
            <TextField
              label="Type your email to confirm"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error ?? undefined}
            />
            <div className="mt-3.5">
              <button
                type="button"
                disabled={!valid || busy}
                onClick={() => void submit()}
                className="min-h-[50px] w-full rounded-control border-[1.5px] border-ember-600 bg-transparent font-body text-[15px] font-semibold text-ember-600 transition-opacity duration-whisper ease-selah disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-600"
              >
                {busy ? 'Sending…' : 'Request account deletion'}
              </button>
            </div>
          </Panel>
        </>
      ) : (
        <Panel className="mt-6 px-[22px] py-[26px] text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-pill border-[1.5px] border-ink-900/30 text-ink-500">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </span>
          <p className="mt-4 font-scripture text-[19px] font-medium italic leading-[1.45] text-ink-900">
            Your request has been received.
          </p>
          <p className="mt-3 font-body text-[13px] leading-[1.6] text-ink-500">
            We&apos;ve emailed {email.trim()} with a confirmation link. Nothing is deleted until you
            confirm. The link expires in 24 hours.
          </p>
        </Panel>
      )}

      <div className="flex-1" />
      <p className="pt-6 text-center font-body text-[12.5px] leading-[1.55] text-vellum-200/60">
        Something we could fix instead? Write to{' '}
        <a
          href="mailto:support@biblediscern.app"
          className="font-semibold text-vellum-100/85 underline underline-offset-[3px]"
        >
          support@biblediscern.app
        </a>
      </p>
    </div>
  );
}
