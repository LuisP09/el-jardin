// El alcance distingue repositorios que comparten el mismo dominio github.io.
const CACHE_PREFIX = `isis-${self.registration.scope}-`;
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const FILES = ['./', './index.html', './style.css', './app.js', './game.css', './game.js', './game-core.js', './gardening.js', './gardening-core.js', './world-layout.js', './world-art.js', './world-map.js', './world-map.css', './game-menus.js', './game-menus.css', './calm-postcards.js', './continuity-core.js', './garden-art.js', './garden-life.js', './calm-games.js', './calm-games-core.js', './calm-games.css', './journal.js', './journal-core.js', './river-scene.js', './arrival-core.js', './arrival.css', './mobile-layout.js', './retreat-art.js', './phase-two.js', './phase-two-core.js', './phase-two-art.js', './phase-two.css', './daily-core.js', './extras.js', './motion.js', './illustration.js', './atmosphere.css', './gardening.css', './audio.js', './soundscape.js', './pwa.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'];
const ASSETS = new Set(FILES.map(path => new URL(path, self.registration.scope).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(
    FILES.map(path => new Request(new URL(path,self.registration.scope),{cache:'reload'}))
  )));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !ASSETS.has(request.url)) return;
  // Cada versión se instala completa; no mezcla HTML y scripts de despliegues distintos.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreVary: true });
    return cached || fetch(request);
  })());
});
