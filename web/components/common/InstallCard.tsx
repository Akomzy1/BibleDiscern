'use client';

// The custom gilt "Install BibleDiscern" affordance — surfaced only at
// high-intent moments (after first scale, after first journey, Settings).
// Android/desktop: native prompt. iOS Safari: instruction sheet.

import { useState } from 'react';
import { Panel, GiltButton } from '@/components/selah';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export function InstallCard({ className }: { className?: string }) {
  const { mode, promptInstall } = useInstallPrompt();
  const [showIosSheet, setShowIosSheet] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (mode === 'hidden' || dismissed) return null;

  return (
    <Panel tone="navy" className={`p-5 ${className ?? ''}`}>
      <p className="font-body text-[14.5px] font-semibold text-vellum-100">
        Install BibleDiscern
      </p>
      <p className="mt-1 font-body text-[12.5px] text-vellum-200/60">
        Add it to your Home Screen — so your Daily Scale can find you.
      </p>
      {mode === 'ios-sheet' && showIosSheet && (
        <ol className="mt-3 grid list-decimal gap-1.5 pl-5 font-body text-[13px] text-vellum-200/80">
          <li>
            Tap the <b>Share</b> button in Safari
          </li>
          <li>
            Choose <b>Add to Home Screen</b>
          </li>
        </ol>
      )}
      <div className="mt-3.5 flex items-center gap-3">
        <GiltButton
          onClick={() => {
            if (mode === 'prompt') void promptInstall();
            else setShowIosSheet(true);
          }}
        >
          {mode === 'prompt' ? 'Install' : 'Show me how'}
        </GiltButton>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="font-body text-[13px] font-semibold text-vellum-200/60 hover:text-vellum-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
        >
          Not now
        </button>
      </div>
    </Panel>
  );
}
