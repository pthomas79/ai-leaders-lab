// Service worker for weak / dropped venue Wi-Fi (password-gated build).
// Copied to deploy/sw.js by tools/encrypt.py.
// Only caches public files: the ENCRYPTED gate page and the font. The app is
// decrypted in memory after the password is entered, so an offline reload
// still shows the gate and asks for the password again.
// On activate it deletes every older 'ailab-' cache, including pre-gate caches
// that held plaintext index.html / prompts.js / script.js.
// Strategy: NETWORK-FIRST with a short timeout, cache only as fallback.
const VERSION = 'bsm-v4-gate';
const CACHE = 'ailab-' + VERSION;
const NETWORK_TIMEOUT_MS = 4000;
const PRECACHE = [
  './',
  'fonts/inter-latin-wght-normal.woff2',
];
const ALLOWED = new Set(['/', '/index.html', '/fonts/inter-latin-wght-normal.woff2']);

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
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!ALLOWED.has(url.pathname) && req.mode !== 'navigate') return;
  event.respondWith(networkFirst(req));
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  const key = req.mode === 'navigate' ? './' : req;
  const network = fetch(req).then((res) => {
    if (res && res.ok && res.type === 'basic') cache.put(key, res.clone());
    return res;
  });
  network.catch(() => {});
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), NETWORK_TIMEOUT_MS));
  try {
    return await Promise.race([network, timeout]);
  } catch (e) {
    const cached = await cache.match(key, { ignoreSearch: true });
    return cached || network;
  }
}
