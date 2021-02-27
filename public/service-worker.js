const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/styles.css",
  "/dist/index.bundle.js",
  "/dist/manifest.json",
  "/dist/icons/icon_72x72.png",
  "/dist/icons/icon_96x96.png",
  "/dist/icons/icon_128x128.png",
  "/dist/icons/icon_144x144.png",
  "/dist/icons/icon_152x152.png",
  "/dist/icons/icon_192x192.png",
  "/dist/icons/icon_384x384.png",
  "/dist/icons/icon_512x512.png",
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// install
self.addEventListener("install", (evt) => {
  // pre cache image data
  evt.waitUntil(caches.open(DATA_CACHE_NAME).then((cache) => cache.add("/api/transaction")));

  // pre cache all static assets
  evt.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));

  // tell the browser to activate this service worker immediately once it
  // has finished installing
  self.skipWaiting();
});

// activate
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        // eslint-disable-next-line array-callback-return
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// fetch
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/transaction")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }

            return response;
          })
          .catch((err) => {
            return cache.match(event.request);
          });
      })
    );
    return;
  }
  // if the request is not for the API, serve static assets using "offline-first" approach.
  // see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-falling-back-to-network
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
