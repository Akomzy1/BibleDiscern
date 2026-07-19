import { notFound } from 'next/navigation';
import { createRscClient } from '@/lib/supabase/rsc';
import { isAdminEmail } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/**
 * Guard for every /admin route. Reads the cookie session server-side and checks
 * it against ADMIN_EMAILS. A non-admin (or signed-out) visitor gets a bare 404 —
 * never a redirect, which would advertise that the route exists. Standalone
 * chrome: no TabBar, a wide utilitarian frame (admin is fidelity-exempt).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createRscClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) notFound();

  return <div className="min-h-screen bg-nave-900 text-vellum-100">{children}</div>;
}
