'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthShell, OrDivider, GoogleButton } from '@/components/auth/AuthShell';
import { GiltButton, TextField } from '@/components/selah';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthShell
      below={
        <span>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-vellum-100/85 underline underline-offset-[3px]">
            Log in
          </Link>
        </span>
      }
    >
      <h1 className="text-center font-display text-xl font-medium text-ink-900">
        Create your account
      </h1>

      {auth.notice ? (
        <p className="mt-5 text-center font-scripture text-[17px] italic leading-relaxed text-ink-900">
          {auth.notice}
        </p>
      ) : (
        <form
          className="mt-5 grid gap-3.5"
          onSubmit={(e) => {
            e.preventDefault();
            void auth.signUp(email, password);
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
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="8+ characters"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={auth.error ?? undefined}
          />
          <div className="mt-1">
            <GiltButton type="submit" fullWidth disabled={auth.busy}>
              {auth.busy ? 'Creating…' : 'Create my account'}
            </GiltButton>
          </div>
        </form>
      )}

      <OrDivider />
      <GoogleButton onClick={() => void auth.signInWithGoogle()} disabled={auth.busy} />

      <p className="mt-4 text-center font-body text-xs leading-[1.55] text-ink-500">
        By continuing you agree to our{' '}
        <Link href="/terms" className="text-gilt-500 underline underline-offset-2">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-gilt-500 underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthShell>
  );
}
