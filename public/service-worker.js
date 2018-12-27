//// SERVICE WORKER. Siempre a la escucha en segundo plano.
//// Aunque el usuario no tenga abierta la página web.


// Nombre de la caché
const CACHE_NAME = 'tiendaw-v2';

// Archivos necesarios para el funcionamiento offline
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js'
];

// INSTALL
// Realizamos el cacheo de la APP SHELL
self.addEventListener('install', function (e) {
  console.log("[Service Worker] * Instalado.");

  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        console.log('[Service Worker] Cacheando app shell');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(function () {
        console.log('[Service Worker] Todos los recursos han sido cacheados');
        return self.skipWaiting();
      })
  );

});


// ACTIVATE
// Eliminamos cachés antiguas.
self.addEventListener('activate', function (e) {
  console.log("[Service Worker] * Activado.");

  e.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log("[Service Worker] Borrando caché antigua: ", cacheName);
              return caches.delete(cacheName);
            }
          })
        )
      })
  );
});


// FETCH
// Hacemos peticiones a recursos.
self.addEventListener('fetch', function (e) {
  console.log("[Service Worker] * Fetch.");

  // Hacemos petición a la red y si no está disponible obtenemos desde la caché
  e.respondWith(fetch(e.request)
    .catch(function () { return caches.match(e.request) }));

});


// PUSH
self.addEventListener('push', function (e) {
  // Mantener el service worker a la espera hasta que la notificación sea creada.
  e.waitUntil(
    // Mostrar una notification con título 'Notificación importante' y cuerpo 'Alea iacta est'.
    self.registration.showNotification('Notificación importante', {
      body: 'Alea iacta est',
    })
  );
});
