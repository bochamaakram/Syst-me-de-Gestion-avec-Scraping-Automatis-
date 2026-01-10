// Knowway Service Worker
const CACHE_NAME = 'knowway-v3'; // Bumped version to clear old cache and fix CSS loading
const urlsToCache = [
    '/',
    '/index.html',
    '/explore.html',
    '/learning.html',
    '/course.html',
    '/profile.html',
    '/login.html',
    '/register.html',
    '/css/output.css',
    '/manifest.json'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.log('Cache install failed:', error);
            })
    );
    // Activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Take control of all pages immediately
    self.clients.claim();
});

// Fetch event - NETWORK-FIRST for API and CSS, CACHE-FIRST for other static assets
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // NEVER cache API requests - always go to network
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    // If network fails, return a JSON error
                    return new Response(
                        JSON.stringify({ success: false, message: 'Network error - you are offline' }),
                        { headers: { 'Content-Type': 'application/json' } }
                    );
                })
        );
        return;
    }

    // NETWORK-FIRST for CSS files to prevent stale styles on reload
    if (url.pathname.endsWith('.css')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Cache the fresh CSS for offline use
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    // Fall back to cache if network fails
                    return caches.match(event.request);
                })
        );
        return;
    }

    // For other static assets, use cache-first strategy
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request).then((response) => {
                    // Only cache static assets (HTML, CSS, JS, images)
                    if (!response || response.status !== 200 || response.type !== 'basic' || event.request.method !== 'GET') {
                        return response;
                    }

                    // Only cache known static file types
                    const contentType = response.headers.get('content-type') || '';
                    if (!contentType.includes('text/html') &&
                        !contentType.includes('text/css') &&
                        !contentType.includes('javascript') &&
                        !contentType.includes('image/')) {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
            })
            .catch(() => {
                // Return offline page if available
                return caches.match('/index.html');
            })
    );
});
