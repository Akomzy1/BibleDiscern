import { vi } from 'vitest';

/**
 * Minimal chainable mock of a supabase-js query builder.
 * Every method returns the builder; awaiting it (or .single()) resolves
 * to the provided result ({ data, error }).
 */
export function makeBuilder(result: { data: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {};
  const methods = [
    'select',
    'eq',
    'in',
    'order',
    'limit',
    'insert',
    'update',
    'upsert',
    'delete',
  ];
  for (const m of methods) {
    builder[m] = vi.fn(() => builder);
  }
  builder.single = vi.fn(() => Promise.resolve(result));
  // Support `await builder` (updates/deletes without .single())
  builder.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve);
  return builder;
}

export function jsonRequest(url: string, body?: unknown, method = 'POST') {
  return new Request(url, {
    method,
    headers: { 'content-type': 'application/json', authorization: 'Bearer test-token' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}
