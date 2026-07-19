// The quiet auth shell — nave800 ground, cross + wordmark, one vellum panel.
// (Auth frames C/D/E, docs/prototypes/upgrade-settings-auth.html)

import { CrossGlyph, Panel, Wordmark } from '@/components/selah';

type AuthShellProps = {
  children: React.ReactNode;
  below?: React.ReactNode;
};

export function AuthShell({ children, below }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-nave-800">
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-11 pt-safe">
        <CrossGlyph muted />
        <Wordmark cross={false} className="mt-3" />
        <Panel className="mt-7 w-full max-w-[340px] px-[22px] py-6">{children}</Panel>
        {below && (
          <div className="mt-5 font-body text-[13.5px] text-vellum-200/60">{below}</div>
        )}
      </div>
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="my-4 flex items-center gap-3" aria-hidden>
      <span className="h-px flex-1 bg-ink-900/10" />
      <span className="font-body text-xs text-ink-500">or</span>
      <span className="h-px flex-1 bg-ink-900/10" />
    </div>
  );
}

export function GoogleButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="min-h-[48px] w-full rounded-control border border-ink-900/20 bg-transparent font-body text-[15px] font-semibold text-ink-900 transition-colors duration-whisper ease-selah hover:bg-ink-900/5 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
    >
      Continue with Google
    </button>
  );
}
