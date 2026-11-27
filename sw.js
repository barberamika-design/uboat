
const CACHE_NAME = 'uboat-v7-final-v12';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './pwa_icons/icon-72.png',
  './pwa_icons/icon-96.png',
  './pwa_icons/icon-128.png',
  './pwa_icons/icon-144.png',
  './pwa_icons/icon-152.png',
  './pwa_icons/icon-192.png',
  './pwa_icons/icon-384.png',
  './pwa_icons/icon-512.png',
  './pwa_icons/icon-1024.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      if(resp) return resp;
      return fetch(event.request).then(r=>{
        // cache dynamic
        if(event.request.method==='GET' && event.request.url.startsWith(self.location.origin)){
          let clone = r.clone();
          caches.open(CACHE_NAME).then(c=>c.put(event.request, clone));
        }
        return r;
      }).catch(()=> caches.match('./index.html'));
    })
  );
});
