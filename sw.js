// GitHub Pages 등 HTTPS에서만 등록되는 선택적 오프라인 캐시.
// 웹앱 파일을 업데이트하면 CACHE_VERSION 숫자를 올려주세요.
const CACHE_VERSION = 'phuquoc-family-v3';
const STATIC_FILES = [
  './', './index.html', './styles.css', './data.js', './store.js', './app.js',
  './manifest.webmanifest', './assets/icon.svg', './assets/touch-icon.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(STATIC_FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('phuquoc-family-') && k !== CACHE_VERSION).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestURL = new URL(event.request.url);
  if (requestURL.origin !== self.location.origin) return;
  // Static asset requests may be served from cache offline.
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
