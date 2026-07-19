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

