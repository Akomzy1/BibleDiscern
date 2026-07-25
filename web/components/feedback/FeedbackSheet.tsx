'use client';

// Settings "Share feedback" sheet (source='settings'). A vellum card sheet over
// a dimmed ground. Motion is a simple mount; no transition to gate on
// prefers-reduced-motion.

import { Panel } from '@/components/selah';
import { FeedbackForm } from './FeedbackForm';

export function FeedbackSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-nave-950/60 px-4 pb-6 pt-20"
      role="dialog"
      aria-modal="true"
      aria-label="Share feedback"
      onClick={onClose}
    >
      <div className="w-full max-w-[608px]" onClick={(e) => e.stopPropagation()}>
        <Panel className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-medium text-ink-900">Share feedback</h2>
              <p className="mt-0.5 font-body text-[13px] text-ink-500">
                How is BibleDiscern serving you?
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex flex-none rounded-pill p-1.5 text-ink-500 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div className="mt-4">
            <FeedbackForm source="settings" onDone={onClose} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
