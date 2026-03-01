const CACHE = 'fc-v1';
const ASSETS = [
  './',
  './fraction-crusher.html',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800;900&family=Share+Tech+Mono&family=Rajdhani:wght@500;600;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      // Cache font files on first fetch
      if (e.request.url.includes('fonts.g') || e.request.url.includes('fonts.googleapis')) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
