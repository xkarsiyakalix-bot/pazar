// Service Worker for ExVitrin PWA
const CACHE_NAME = 'exvitrin-v1';
const RUNTIME_CACHE = 'exvitrin-runtime';

// Assets to cache on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/static/css/main.css',
    '/static/js/main.js',
    '/logo_exvitrin_new.png',
    '/logo_exvitrin_2026_cropped.png',
    '/manifest.json'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Precaching assets');
                return cache.addAll(PRECACHE_URLS.map(url => new Request(url, { cache: 'reload' })));
            })
            .catch((error) => {
                console.error('[Service Worker] Precache failed:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
                    .map((cacheName) => {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.open(RUNTIME_CACHE).then((cache) => {
            return fetch(event.request)
                .then((response) => {
                    // Cache successful responses
                    if (response.status === 200) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                })
                .catch(() => {
                    // Network failed, try cache
                    return caches.match(event.request).then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        return new Response('Offline', { status: 503 });
                    });
                });
        })
    );
});

// Push notification event
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push received:', event);

    let notificationData = {
        title: 'ExVitrin',
        body: 'Yeni bir bildiriminiz var!',
        icon: '/logo_exvitrin_2026_cropped.png',
        badge: '/logo_exvitrin_2026_cropped.png',
        vibrate: [200, 100, 200],
        tag: 'exvitrin-notification',
        requireInteraction: false
    };

    if (event.data) {
        try {
            const data = event.data.json();
            notificationData = {
                ...notificationData,
                title: data.title || notificationData.title,
                body: data.body || notificationData.body,
                icon: data.icon || notificationData.icon,
                data: data.data || {},
                actions: data.actions || []
            };
        } catch (e) {
            console.error('[Service Worker] Error parsing push data:', e);
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked:', event);
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if there's already a window open
                for (let client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Open new window
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// Background sync event (for offline actions)
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);

    if (event.tag === 'sync-messages') {
        event.waitUntil(
            // Sync messages when back online
            fetch('/api/sync-messages', { method: 'POST' })
                .then(response => console.log('[Service Worker] Messages synced'))
                .catch(error => console.error('[Service Worker] Sync failed:', error))
        );
    }
});

// Periodic background sync (for checking new messages)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'check-new-messages') {
        event.waitUntil(
            fetch('/api/check-new-messages')
                .then(response => response.json())
                .then(data => {
                    if (data.hasNew) {
                        return self.registration.showNotification('ExVitrin', {
                            body: 'Yeni mesajlarınız var!',
                            icon: '/logo_exvitrin_2026_cropped.png',
                            badge: '/logo_exvitrin_2026_cropped.png',
                            tag: 'new-messages',
                            data: { url: '/messages' }
                        });
                    }
                })
                .catch(error => console.error('[Service Worker] Check messages failed:', error))
        );
    }
});
