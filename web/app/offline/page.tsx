// The designed offline state — never a browser error. Precached by sw.js and
// served for navigations while offline. (CLAUDE.md "PWA Requirements")

import { Beam, Eyebrow, Panel } from '@/components/selah';

export const metadata = { title: 'Offline' };

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-nave-900 px-6 text-center">
      <Eyebrow>You&apos;re offline</Eyebrow>
      <Beam className="my-4" />
      <Panel tone="navy" className="w-full max-w-sm p-6">
        <h1 className="font-display text-xl text-vellum-100">
          The Word doesn&apos;t need a signal
        </h1>
        <p className="mt-2 font-body text-sm leading-relaxed text-vellum-200/80">
          — but this app does for new content. If you&apos;ve already opened today&apos;s scale,
          it&apos;s still here waiting on the Today tab.
        </p>
      </Panel>
    </main>
  );
}
