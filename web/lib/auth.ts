import { NextRequest } from 'next/server';
import { createServerClient } from './supabase/server';
import type { User } from '@supabase/supabase-js';

export interface AuthResult {
  user: User;
  token: string;
}

/**
 * Extracts and validates the Bearer token from the Authorization header.
 * Returns the authenticated user or throws with a descriptive message.
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError('Missing or malformed Authorization header.', 401);
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    throw new AuthError('Empty auth token.', 401);
  }

  const supabase = createServerClient(token);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthError('Invalid or expired auth token.', 401);
  }

  return { user, token };
}

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status: number = 401,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
