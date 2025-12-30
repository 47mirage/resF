// sw.js
const CACHE = 'tdive-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './a4fa526974c27acd.css',
  './fd30ee9cf531f512.css',
  './diveqr.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
  // ※ 同一オリジンの追加アセットがあればここに追記
  // GCSの画像など別オリジンはここには入れても効きません（PWA要件には影響なし）
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ネット優先・失敗時にキャッシュ
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
