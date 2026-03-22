interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store — resets on cold start. Sufficient for MVP.
// Replace with Upstash Redis for multi-instance deployments.
const store = new Map<string, RateLimitEntry>();

/**
 * Returns true if the request is allowed, false if rate-limited.
 * Default: 10 requests per 60 seconds per key.
 */
export function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

// Prune stale entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60_000);
