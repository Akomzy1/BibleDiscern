import { NextResponse } from 'next/server';
import { AuthError } from './auth';
import { NotFoundError } from './admin';
import { ZodError } from 'zod';

/** Wrap a successful payload in the standard { data } envelope */
export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

/** Standard API error response shape */
export function err(
  error: string,
  message: string,
  status: number,
  details?: unknown,
): NextResponse {
  return NextResponse.json({ error, message, ...(details ? { details } : {}) }, { status });
}

/**
 * Top-level error handler for API routes.
 * Handles AuthError, ZodError, and unknown errors uniformly.
 */
export function handleError(e: unknown): NextResponse {
  if (e instanceof NotFoundError) {
    // Admin surfaces present the same 404 to non-admins as to the public.
    return err('not_found', e.message, 404);
  }

  if (e instanceof AuthError) {
    return err('unauthorized', e.message, e.status);
  }

  if (e instanceof ZodError) {
    return err(
      'validation_error',
      'Request validation failed.',
      400,
      e.flatten().fieldErrors,
    );
  }

  console.error('[API Error]', e);
  return err('server_error', 'An unexpected error occurred. Please try again.', 500);
}
