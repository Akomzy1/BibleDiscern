import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(`cache:${key}`);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      await AsyncStorage.removeItem(`cache:${key}`);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export async function setCached<T>(key: string, data: T, ttlMs: number): Promise<void> {
  try {
    const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttlMs };
    await AsyncStorage.setItem(`cache:${key}`, JSON.stringify(entry));
  } catch {
    // Non-fatal — caching is best-effort
  }
}

export async function clearCached(key: string): Promise<void> {
  await AsyncStorage.removeItem(`cache:${key}`);
}

// ─── ttlMinutes-based aliases (used in Stage 5 spec) ─────────────────────────

/** Store data with a TTL in minutes. */
export async function cacheData<T>(key: string, data: T, ttlMinutes: number): Promise<void> {
  return setCached(key, data, ttlMinutes * 60 * 1000);
}

/** Retrieve cached data if not expired. */
export async function getCachedData<T>(key: string): Promise<T | null> {
  return getCached<T>(key);
}

/** Clear all librato cache entries from AsyncStorage. */
export async function clearCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((k) => k.startsWith('cache:'));
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
  } catch {
    // Non-fatal
  }
}
