// Offline shell for the sales simulator. Bump version after edits.
const CACHE_NAME = 'ohkuraya-sale-pwa-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('ohkuraya-sale-pwa-') && key !== CACHE_NAME).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  if (!url.pathname.startsWith(scope.pathname)) return;
  // Navigation uses the cached HTML immediately, including when offline.
  if (request.mode === 'navigate') {
    event.respondWith(caches.match('./index.html').then(response => response || fetch(request)));
    return;
  }
  event.respondWith(caches.match(request).then(response => response || fetch(request)));
});
