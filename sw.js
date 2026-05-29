const CACHE = 'perks-v1';
const CORE_ASSETS = ['./index.html', './data.js', './manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      // Core assets are required; icons are best-effort
      return cache.addAll(CORE_ASSETS).then(() =>
        Promise.allSettled([
          cache.add('./icons/icon.svg'),
          cache.add('./icons/icon-192.png'),
          cache.add('./icons/icon-512.png'),
        ])
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first, falling back to network and caching the response.
self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
