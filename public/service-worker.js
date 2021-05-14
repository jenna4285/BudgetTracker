const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.js",
    "/manifest.webmanifest",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

self.addEventListener("install", function (evt) {
    console.log("attempting to install service worker and cache static assets");
    evt.waitUntil(
      caches.open(DATA_CACHE_NAME).then((cache) => { return cache.add("/api/transaction")})
    );
    evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {return cache.addAll(FILES_TO_CACHE)})
    );
    self.skipWaiting();
  });


self.addEventListener("activate", function(evt) {
evt.waitUntil(
    caches.keys().then(keyList => {
    return Promise.all(
        keyList.map(key => {
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

self.addEventListener('fetch', event => {
event.respondWith(
    caches.match(event.request).then( response => {
    return response || fetch(event.request);
    })
);
});