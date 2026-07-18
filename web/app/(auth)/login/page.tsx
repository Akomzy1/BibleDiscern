'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthShell, OrDivider, GoogleButton } from '@/components/auth/AuthShell';
import { GiltButton, TextField } from '@/components/selah';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthShell
      below={
        <span>
          New here?{' '}
          <Link href="/signup" className="font-semibold text-vellum-100/85 underline underline-offset-[3px]">
            Create an account
          </Link>
        </span>
      }
    >
      <h1 className="text-center font-display text-xl font-medium text-ink-900">Welcome back</h1>

      <form
        className="mt-5 grid gap-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          void auth.signIn(email, password);
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
        <div>
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={auth.error ?? undefined}
          />
          <div className="mt-2 text-right">
            <Link
              href="/reset-password"
              className="font-body text-[12.5px] font-semibold text-gilt-500 hover:text-gilt-300"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <GiltButton type="submit" fullWidth disabled={auth.busy}>
          {auth.busy ? 'Signing in…' : 'Log in'}
        </GiltButton>
      </form>

      <OrDivider />
      <GoogleButton onClick={() => void auth.signInWithGoogle()} disabled={auth.busy} />
    </AuthShell>
  );
}
