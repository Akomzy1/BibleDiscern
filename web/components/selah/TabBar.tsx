'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Bottom nav, four items: Today / Discern / Journal / Settings. Active = gilt
// icon + label; inactive = gilt300 @45%. Handles standalone safe-area insets.
// Hidden inside the Journey flow and Onboarding (those layouts simply don't
// render it). (SKILL.md §8)

type TabIconProps = { className?: string };

function TodayIcon({ className }: TabIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
    </svg>
  );
}

function DiscernIcon({ className }: TabIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden>
      <path d="M4 8h16" />
      <path d="M12 8v11" />
      <path d="M9.5 21h5" />
      <path d="M12 8V5" />
      <path d="M7 8l-2.5 5a2.8 2.8 0 0 0 5 0L7 8ZM17 8l-2.5 5a2.8 2.8 0 0 0 5 0L17 8Z" />
    </svg>
  );
}

function JournalIcon({ className }: TabIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden>
      <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v16.5H6.5A1.5 1.5 0 0 0 5 21V4.5Z" />
      <path d="M5 19.5A1.5 1.5 0 0 1 6.5 18H19" />
      <path d="M9 8h6" />
    </svg>
  );
}

function SettingsIcon({ className }: TabIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
      <circle cx="9" cy="7" r="1.8" fill="var(--nave-900)" />
      <circle cx="15" cy="12" r="1.8" fill="var(--nave-900)" />
      <circle cx="7" cy="17" r="1.8" fill="var(--nave-900)" />
    </svg>
  );
}

const TABS = [
  { href: '/today', label: 'Today', Icon: TodayIcon },
  { href: '/discern', label: 'Discern', Icon: DiscernIcon },
  { href: '/journal', label: 'Journal', Icon: JournalIcon },
  { href: '/settings', label: 'Settings', Icon: SettingsIcon },
] as const;

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gilt-edge bg-nave-900/95 pb-safe backdrop-blur"
    >
      <ul className="mx-auto flex max-w-screen-sm items-stretch justify-around">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 font-body text-[11px] font-semibold transition-colors duration-whisper ease-selah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 ${
                  active ? 'text-gilt-500' : 'text-gilt-300/45 hover:text-gilt-300/70'
                }`}
              >
                <Icon className="h-6 w-6" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
