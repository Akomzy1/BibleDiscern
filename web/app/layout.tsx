import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LibratoAi — Weigh it with wisdom',
  description:
    'From the Latin librato — to weigh, to balance, to ponder. An AI-powered Christian Discernment Companion.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
