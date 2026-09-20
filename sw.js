// RuralCare Service Worker (SIH 2026 - Team VisionX)
const CACHE_NAME = 'ruralcare-v1.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './styles.css',
  './icons.js',
  './i18n.js',
  './firebase-config.js',
  './store.js',
  './idb-queue.js',
  './voice-assistant.js',
  './router.js',
  './app.js',
  './landing.js',
  './login.js',
  './dashboards.js',
  './appointments.js',
  './emergency.js',
  './ambulance.js',
  './teleconsult.js',
  './records.js',
  './referrals.js',
  './medicines.js',
  './followups.js',
  './offline.js',
  './blood.js',
  './organ.js',
  './fund.js',
  './camps.js',
  './analytics.js',
  './ussd-sms.js',
  './about.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[RuralCare SW] Pre-caching offline application shell');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[RuralCare SW] Pre-cache partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[RuralCare SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Navigation requests: serve cached index.html if offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('./index.html');
      })
    );
    return;
  }

  // Cache-first with network fallback for local static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache external assets if valid
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.url.startsWith('http') || event.request.url.startsWith('https'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.log('[RuralCare SW] Fetch offline fallback for:', event.request.url);
        // Fallback for image requests
        if (event.request.destination === 'image') {
          return new Response(
            `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#e2e8f0" width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-size="12">Offline</text></svg>`,
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
      });
    })
  );
});
