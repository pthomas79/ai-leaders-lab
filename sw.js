// Service worker for weak / dropped venue Wi-Fi.
// Strategy: NETWORK-FIRST for every same-origin GET (with a short timeout),
// falling back to the cache only when the network fails or is too slow.
// So whenever the network works, users get the latest deploy; the cache is
// just an offline safety net. Bump VERSION on releases to drop old caches.
const VERSION = 'bsm-v3-2026-10-21';
const CACHE = 'ailab-' + VERSION;
const NETWORK_TIMEOUT_MS = 4000;
const PRECACHE = [
  './',
  'index.html',
  'styles.css',
  'script.js',
  'prompts.js',
  'vendor/alpine-3.17.5.min.js',
  'fonts/inter-latin-wght-normal.woff2',
  'assets/bsm-logo-white.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('ailab-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(networkFirst(req));
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  const network = fetch(req).then((res) => {
    if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
    return res;
  });
  network.catch(() => {}); // avoid unhandled rejection when we fall back
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), NETWORK_TIMEOUT_MS));
  try {
    return await Promise.race([network, timeout]);
  } catch (e) {
    const cached = (await cache.match(req, { ignoreSearch: true })) ||
      (req.mode === 'navigate' ? (await cache.match('index.html')) || (await cache.match('./')) : undefined);
    return cached || network; // nothing cached: keep waiting on the network
  }
}
