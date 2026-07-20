import Link from 'next/link';
import { requireAdminRSC } from '@/lib/supabase/rsc';

export const dynamic = 'force-dynamic';

/**
 * Guard + chrome for every /admin route. requireAdminRSC reads the cookie
 * session and 404s anyone not on the ADMIN_EMAILS allowlist (never a redirect —
 * that would advertise the route). Standalone utilitarian frame: a slim tab nav,
 * no TabBar (admin is fidelity-exempt internal tooling).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminRSC();

  return (
    <div className="min-h-screen bg-nave-900 text-vellum-100">
      <header className="border-b border-vellum-100/10">
        <div className="mx-auto flex w-full max-w-[1100px] items-center gap-1 px-5 py-3">
          <span className="mr-3 font-display text-[15px] font-medium text-vellum-100">Admin</span>
          <AdminTab href="/admin" label="Overview" />
          <AdminTab href="/admin/scales" label="Daily Scales" />
        </div>
      </header>
      {children}
    </div>
  );
}

// Server component — no active-state highlighting (that needs a client hook);
// keep it a plain, legible nav.
function AdminTab({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-pill px-3.5 py-1.5 font-body text-[13px] font-semibold text-vellum-200/70 transition-colors hover:bg-nave-800 hover:text-vellum-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
    >
      {label}
    </Link>
  );
}
