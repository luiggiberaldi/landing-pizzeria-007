/* =====================================================
   Pizzería 007 — Service Worker
   Estrategia:
   - HTML: network-first (caída a cache)
   - CSS/JS/Fuentes: stale-while-revalidate
   - Imágenes: cache-first con fallback
   ===================================================== */
var CACHE_VERSION = 'pizzeria007-v2-1';
var PRECACHE_URLS = [
  './',
  './index.html',
  './css/styles.css',
  './js/main.js',
  './manifest.json',
  './assets/logo-007.png',
  './assets/favicon.png',
  './assets/instagram/foto-11.webp',
  './assets/instagram/foto-03.webp',
  './assets/instagram/foto-06.webp',
  'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap'
];

// Instalación: precachear recursos críticos
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      // No fallar si algún recurso externo no se puede cachear
      return Promise.allSettled(
        PRECACHE_URLS.map(function (url) {
          return cache.add(url).catch(function () { /* ignorar fallos individuales */ });
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// Activación: limpiar caches antiguas
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_VERSION; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Fetch strategy
self.addEventListener('fetch', function (event) {
  var req = event.request;
  // Ignorar peticiones no GET
  if (req.method !== 'GET') return;

  var url = new URL(req.url);

  // Para navegaciones (HTML): network-first
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') !== -1) {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE_VERSION).then(function (c) { c.put('./index.html', copy); });
          return res;
        })
        .catch(function () {
          return caches.match('./index.html').then(function (r) {
            return r || caches.match(req);
          });
        })
    );
    return;
  }

  // Para CSS/JS/fuentes: stale-while-revalidate
  if (url.origin === self.location.origin &&
      (url.pathname.endsWith('.css') || url.pathname.endsWith('.js') ||
       url.hostname.indexOf('fonts.googleapis') !== -1 ||
       url.hostname.indexOf('fonts.gstatic') !== -1)) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(function (cache) {
        return cache.match(req).then(function (cached) {
          var fetchPromise = fetch(req).then(function (res) {
            cache.put(req, res.clone());
            return res;
          }).catch(function () { return cached; });
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // Para imágenes: cache-first
  if (req.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg|ico)$/i)) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(function (cache) {
        return cache.match(req).then(function (cached) {
          if (cached) return cached;
          return fetch(req).then(function (res) {
            // Solo cachear respuestas válidas
            if (res.status === 200) {
              cache.put(req, res.clone());
            }
            return res;
          }).catch(function () {
            // Fallback: imagen placeholder SVG
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#f2efe9"/><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#999" text-anchor="middle" dy=".3em">Pizzería 007</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          });
        });
      })
    );
    return;
  }

  // Default: intentar red, luego cache
  event.respondWith(
    fetch(req).catch(function () { return caches.match(req); })
  );
});

// Permitir skipWaiting desde la página
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
