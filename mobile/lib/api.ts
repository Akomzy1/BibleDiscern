import { createApiClient, LibratoApiClient } from '@librato/shared';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const apiClient: LibratoApiClient = createApiClient(API_URL);

/**
 * Call this whenever the Supabase auth session changes.
 * Keeps the API client's auth token in sync.
 */
export function setApiAuthToken(token: string | null): void {
  apiClient.setAuthToken(token);
}
