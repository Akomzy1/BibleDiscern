'use client';

// Reusable feedback form — five gilt selectable dots (1-5) + an optional
// one-line message. Shared by the post-journey card and the Settings sheet.
// Selah tokens throughout; motion respects prefers-reduced-motion.

import { useState } from 'react';
import type { FeedbackSource } from '@librato/shared';
import { GiltButton } from '@/components/selah';
import { getAuthedClient } from '@/lib/api';

function Dots({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} of 5`}
            onClick={() => onChange(n)}
            className={`h-6 w-6 rounded-pill border transition-all duration-whisper ease-selah motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 ${
              on
                ? 'border-gilt-500 bg-gilt-500 scale-105'
                : 'border-ink-900/20 bg-transparent hover:border-gilt-500/60'
            }`}
          />
        );
      })}
    </div>
  );
}

export function FeedbackForm({
  source,
  onDone,
  onSkip,
  compact = false,
}: {
  source: FeedbackSource;
  onDone: () => void;
  onSkip?: () => void;
  compact?: boolean;
}) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSubmit = (rating > 0 || message.trim().length > 0) && !busy;

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      const client = await getAuthedClient();
      if (!client) {
        onDone();
        return;
      }
      await client.submitFeedback({
        source,
        rating: rating > 0 ? rating : undefined,
        message: message.trim() ? message.trim() : undefined,
      });
      onDone();
    } catch {
      setError('Could not send just now. Please try again.');
      setBusy(false);
    }
  };

  return (
    <div>
      <Dots value={rating} onChange={setRating} />
      <input
        type="text"
        value={message}
        maxLength={2000}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="A word, if you'd like…"
        aria-label="Optional message"
        className={`${compact ? 'mt-4' : 'mt-5'} w-full rounded-control border border-ink-900/15 bg-vellum-200 px-3.5 py-2.5 font-body text-[14px] text-ink-900 placeholder:text-ink-500/60 focus:border-gilt-500 focus:outline-none focus:ring-1 focus:ring-gilt-500`}
      />
      {error && <p className="mt-2.5 font-body text-[12.5px] text-ember-600">{error}</p>}
      <div className={`${compact ? 'mt-4' : 'mt-5'} flex flex-col items-center gap-2.5`}>
        <GiltButton fullWidth onClick={() => void submit()} disabled={!canSubmit}>
          {busy ? 'Sending…' : 'Send'}
        </GiltButton>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            disabled={busy}
            className="py-1 font-body text-[13px] font-semibold text-ink-500 transition-colors duration-whisper ease-selah motion-reduce:transition-none hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
