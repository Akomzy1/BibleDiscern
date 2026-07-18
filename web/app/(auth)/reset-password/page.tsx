'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { GiltButton, TextField } from '@/components/selah';
import { useAuth } from '@/hooks/useAuth';

function SentCheck() {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-pill border-[1.5px] border-olive-500 text-olive-500">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

export default function ResetPasswordPage() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      below={
        <Link href="/login" className="font-semibold text-vellum-100/85 underline underline-offset-[3px]">
          Back to log in
        </Link>
      }
    >
      {!sent ? (
        <>
          <h1 className="text-center font-display text-xl font-medium text-ink-900">
            Reset your password
          </h1>
          <p className="mt-2 text-center font-body text-[13.5px] leading-normal text-ink-500">
            Enter your email and we&apos;ll send you a link.
          </p>
          <form
            className="mt-5"
            onSubmit={(e) => {
              e.preventDefault();
              void auth.resetPassword(email).then((ok) => ok && setSent(true));
            }}
          >
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={auth.error ?? undefined}
            />
            <div className="mt-[18px]">
              <GiltButton type="submit" fullWidth disabled={auth.busy}>
                {auth.busy ? 'Sending…' : 'Send reset link'}
              </GiltButton>
            </div>
          </form>
        </>
      ) : (
        <div className="py-1 text-center">
          <SentCheck />
          <p className="mt-4 font-scripture text-[19px] font-medium italic leading-[1.45] text-ink-900">
            Check your inbox — the link is on its way.
          </p>
          <p className="mt-3 font-body text-[12.5px] leading-[1.55] text-ink-500">
            We sent it to {email}. The link expires in 30 minutes.
          </p>
        </div>
      )}
    </AuthShell>
  );
}
