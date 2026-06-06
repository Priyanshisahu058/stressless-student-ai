/**
 * StressLess Student AI - Service Worker
 * Basic offline caching for GitHub Pages deployment.
 */

const CACHE_NAME = 'stressless-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
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
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first for API calls, cache-first for assets
  if (e.request.url.includes('generativelanguage.googleapis.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
