'use client';

// Settings — grouped vellum rows per the Settings frame: Profile, Daily
// practice (time pills, notifications, sound cues off-default), Subscription
// (status + Manage billing -> Stripe portal), App (Install — hidden when
// installed, Privacy, Terms), Account (Sign out, Delete account = ember).
// Footer "v2.0 · Weigh it with wisdom".

import Link from 'next/link';
import { StatusChip, TimePills, Toggle, VellumGrain } from '@/components/selah';
import { useSettings } from '@/hooks/useSettings';
import { useSubscription } from '@/hooks/useSubscription';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

const TIME_OPTIONS = ['7:00 AM', '8:00 AM', '9:00 AM'] as const;
const TO_LABEL: Record<string, string> = {
  '07:00': '7:00 AM',
  '08:00': '8:00 AM',
  '09:00': '9:00 AM',
};
const TO_VALUE: Record<string, string> = {
  '7:00 AM': '07:00',
  '8:00 AM': '08:00',
  '9:00 AM': '09:00',
};

function RowPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-panel border border-ink-900/10 bg-vellum-100 px-4 py-[13px] shadow-glow ${className ?? ''}`}
    >
      <VellumGrain />
      <div className="relative">{children}</div>
    </div>
  );
}

function NavRow({
  label,
  href,
  onClick,
  ember = false,
  note,
  chevron = true,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  ember?: boolean;
  note?: string;
  chevron?: boolean;
}) {
  const inner = (
    <>
      <div className="flex min-h-6 items-center justify-between gap-3">
        <span className={`font-body text-[15px] ${ember ? 'text-ember-600' : 'text-ink-900'}`}>
          {label}
        </span>
        {chevron && (
          <span className="inline-flex text-ink-500" aria-hidden>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </span>
        )}
      </div>
      {note && <div className="mt-[3px] font-body text-[12.5px] text-ink-500">{note}</div>}
    </>
  );
  const cls =
    'relative block w-full overflow-hidden rounded-panel border border-ink-900/10 bg-vellum-100 px-4 py-[13px] text-left shadow-glow transition-transform duration-whisper ease-selah active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500';
  if (href) {
    return (
      <Link href={href} className={cls}>
        <VellumGrain />
        <div className="relative">{inner}</div>
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      <VellumGrain />
      <div className="relative">{inner}</div>
    </button>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-1 mt-3.5 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-vellum-200/60">
      {children}
    </p>
  );
}

export default function SettingsPage() {
  const s = useSettings();
  const sub = useSubscription();
  const install = useInstallPrompt();

  if (s.status === 'loading') {
    return <main className="min-h-[60vh] animate-pulse" aria-busy />;
  }

  const name = s.profile?.display_name ?? s.profile?.full_name ?? null;
  const initials = (name ?? s.email ?? 'B D')
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  const planChip = sub.isPremium
    ? sub.subscription?.billing_interval === 'year'
      ? 'Premium Annual'
      : sub.subscription?.status === 'trialing'
        ? 'Premium Trial'
        : 'Premium Monthly'
    : 'Free';
  const timeLabel = TO_LABEL[s.profile?.daily_scale_time ?? '08:00'] ?? '8:00 AM';

  return (
    <main className="flex min-h-[85vh] flex-col gap-2.5 pb-4">
      <h1 className="mx-1 mb-1 mt-2 font-display text-2xl font-medium text-vellum-100">Settings</h1>

      {/* Profile */}
      <RowPanel>
        <div className="flex items-center gap-3.5">
          <span className="inline-flex h-[42px] w-[42px] flex-none items-center justify-center rounded-pill bg-nave-800 font-display text-[15px] text-vellum-100">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            {name && (
              <span className="block font-body text-[15px] font-semibold text-ink-900">{name}</span>
            )}
            <span className="mt-0.5 block truncate font-body text-[12.5px] text-ink-500">
              {s.email}
            </span>
          </span>
        </div>
      </RowPanel>

      <GroupLabel>Daily practice</GroupLabel>
      <RowPanel>
        <p className="font-body text-[15px] text-ink-900">Daily Scale time</p>
        <p className="mt-[3px] font-body text-[12.5px] text-ink-500">
          When your question finds you each morning.
        </p>
        <TimePills
          options={TIME_OPTIONS}
          value={timeLabel}
          onChange={(label) => void s.setScaleTime(TO_VALUE[label])}
          className="mt-3 [&>button[aria-checked=false]]:!text-ink-500"
        />
      </RowPanel>
      <RowPanel>
        <Toggle
          checked={s.notifications}
          disabled={s.busy}
          onChange={(on) => void s.toggleNotifications(on)}
          label="Notifications"
          note="A gentle push at your chosen time."
        />
      </RowPanel>
      <RowPanel>
        <Toggle
          checked={s.soundCues}
          onChange={s.toggleSoundCues}
          label="Sound cues"
          note="Soft chimes on commit and save."
        />
      </RowPanel>

      <GroupLabel>Subscription</GroupLabel>
      <RowPanel>
        <div className="flex min-h-6 items-center justify-between gap-3">
          <span className="font-body text-[15px] text-ink-900">Plan</span>
          <StatusChip tone={sub.isPremium ? 'success' : 'outline'} className={sub.isPremium ? '' : 'border-ink-900/20 !text-ink-500'}>
            {planChip}
          </StatusChip>
        </div>
        <button
          type="button"
          disabled={sub.busy}
          onClick={() => {
            if (sub.isPremium) void sub.openPortal();
            else window.location.assign('/upgrade');
          }}
          className="mt-3 flex w-full items-center justify-between border-t border-ink-900/10 pt-[11px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 disabled:opacity-60"
        >
          <span className="font-body text-[14.5px] font-semibold text-ink-900">
            {sub.isPremium
              ? sub.busy
                ? 'Opening billing…'
                : 'Manage billing'
              : 'Start my 7-day free trial'}
          </span>
          <span className="inline-flex text-ink-500" aria-hidden>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M14 5h5v5" />
              <path d="M19 5 9 15" />
              <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
            </svg>
          </span>
        </button>
        {sub.error && (
          <p className="mt-2.5 font-body text-[12.5px] leading-snug text-ember-600">{sub.error}</p>
        )}
      </RowPanel>

      <GroupLabel>App</GroupLabel>
      {install.mode !== 'hidden' && (
        <NavRow
          label="Install BibleDiscern"
          note="Add to your Home Screen — hidden once installed."
          chevron={false}
          onClick={() => {
            if (install.mode === 'prompt') void install.promptInstall();
            else window.alert('In Safari: tap Share, then "Add to Home Screen".');
          }}
        />
      )}
      <NavRow label="Privacy Policy" href="/privacy" />
      <NavRow label="Terms of Service" href="/terms" />

      <GroupLabel>Account</GroupLabel>
      <NavRow label="Sign out" chevron={false} onClick={() => void s.signOut()} />
      <NavRow label="Delete account" chevron={false} ember href="/delete-account" />

      <div className="flex-1" />
      <p className="pb-1 pt-3.5 text-center font-body text-xs text-vellum-200/60">
        v2.0 · Weigh it with wisdom
      </p>
    </main>
  );
}
