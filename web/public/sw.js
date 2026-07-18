/* BibleDiscern service worker — hand-rolled (CLAUDE.md "PWA Requirements").
 * Precache: app shell + icons + manifest. Runtime: today's scale =
 * stale-while-revalidate; journal list = network-first; fonts/static =
 * cache-first. NEVER cache /api/discern or anything auth-related. */

const VERSION = 'bd-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const PRECACHE = [
  '/offline',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Paths that must NEVER be cached (safety + freshness)
function neverCache(url) {
  return (
    url.pathname.startsWith('/api/discern') ||
    url.pathname.startsWith('/api/stripe') ||
    url.pathname.startsWith('/api/webhooks') ||
    url.pathname.startsWith('/api/push') ||
    url.pathname.startsWith('/api/delete-account') ||
    url.pathname.startsWith('/auth') ||
    url.pathname.includes('supabase') ||
    url.hostname !== self.location.hostname
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => undefined);
  return cached || (await network) || Response.error();
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error('offline');
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (neverCache(url)) return; // straight to network, never stored

  // Today's scale: stale-while-revalidate
  if (url.pathname === '/api/daily-scale') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  // Journal list: network-first
  if (url.pathname === '/api/journal') {
    event.respondWith(networkFirst(request).catch(() => Response.error()));
    return;
  }
  // Other API GETs: network only
  if (url.pathname.startsWith('/api/')) return;

  // Self-hosted fonts + build assets: cache-first
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navigations: network-first with the designed offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(SHELL_CACHE);
        return (await cache.match('/offline')) || Response.error();
      }),
    );
  }
});

// ── Web Push: the daily scale reminder ──────────────────────────────────────
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'BibleDiscern';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "Today's scale is ready. Weigh it with wisdom.",
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url || '/today' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/today';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
