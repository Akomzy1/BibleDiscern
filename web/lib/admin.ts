import { NextRequest } from 'next/server';
import { requireAuth, type AuthResult } from '@/lib/auth';

/**
 * The admin allowlist — the ADMIN_EMAILS env var, comma-separated, lowercased.
 * The SAME source gates /admin pages (server layout) and every /api/admin route.
 * Empty allowlist = no admins (the surface is dark), never "everyone".
 */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

/**
 * A non-admin request must be indistinguishable from a route that doesn't exist,
 * so the allowlist itself never leaks. Thrown by requireAdmin; handleError maps it
 * to a bare 404. Not a redirect (a redirect advertises the route).
 */
export class NotFoundError extends Error {
  constructor(message = 'Not found.') {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * API-route guard: authenticate, then re-check the allowlist server-side.
 * Every /api/admin route calls this BEFORE any service-role write. Non-admins
 * (and the unauthenticated) get a 404 — the surface never confirms it exists.
 */
export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
  let auth: AuthResult;
  try {
    auth = await requireAuth(request);
  } catch {
    // Collapse auth failures into the same 404 admins-only surface presents.
    throw new NotFoundError();
  }
  if (!isAdminEmail(auth.user.email)) throw new NotFoundError();
  return auth;
}
