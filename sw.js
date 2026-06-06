/**
 * StressLess Student AI - Service Worker v2
 * Network-first for API calls. Cache-first for app assets.
 * Fixed: config.js added to assets, versioned cache name.
 */
const CACHE_VERSION = 'stressless-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './config.js',
  './js/storage.js',
  './js/utils.js',
  './js/gemini.js',
  './js/crisisDetector.js',
  './js/moodTracker.js',
  './js/stressTriggers.js',
  './js/journal.js',
  './js/wellnessScore.js',
  './js/planner.js',
  './js/calmMode.js',
  './js/dashboard.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(ASSETS))
      .catch(err => console.warn('[SW] Cache install error:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE_VERSION)
        .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Network-first for Gemini API & external resources
  if (url.includes('generativelanguage.googleapis.com') || url.includes('fonts.googleapis.com')) {
    e.respondWith(
      fetch(e.request)
        .catch(() => new Response('', { status: 503, statusText: 'Offline' }))
    );
    return;
  }

  // Cache-first for app assets
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'))
      )
  );
});
