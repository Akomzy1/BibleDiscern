'use client';

// "Share this scale" — produces the OG share card via /api/og. Uses the Web
// Share API where available; falls back to copying the link.

import { useState } from 'react';
import { GiltButton } from '@/components/selah';

type ShareCardProps = {
  question: string;
};

export function ShareCard({ question }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const origin = window.location.origin;
    const url = `${origin}/api/og?title=${encodeURIComponent(question)}`;
    const payload = {
      title: 'BibleDiscern — Daily Scale',
      text: question,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch {
      // user cancelled the share sheet — fall through silently
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing further to do
    }
  }

  return (
    <GiltButton variant="secondary" fullWidth onClick={share}>
      {copied ? 'Link copied' : 'Share this scale'}
    </GiltButton>
  );
}
