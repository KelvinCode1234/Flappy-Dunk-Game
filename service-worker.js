const CACHE_NAME = 'flappy-dunk-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/index.css',
    '/app.js',
    '/files/dunk.png',
    '/files/icon_dunk.png',
    '/files/bng.jpg'
];


self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to cache during installation:', error);
            })
    );
});


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                
                return response || fetch(event.request).catch(error => {
                    console.error('Fetch failed, returning fallback:', error);
                    
                    return caches.match('/index.html'); 
                });
            })
    );
});

// Update Service Worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
