const CACHE_NAME = 'him-wong-games-v1';
const urlsToCache = [
    './',
    './index.html',
    './game1.html',
    './game2.html',
    './game3.html',
    './game4.html',
    './game5.html',
    './game6.html',
    './game7.html',
    './game8.html',
    './game9.html',
    './game10.html',
    './game11.html',
    './js/game-engine.js',
    './manifest.json'
];

// 安裝 Service Worker
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
});

// 攔截請求
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 如果找到緩存，返回緩存的響應
                if (response) {
                    return response;
                }
                
                // 否則發送網絡請求
                return fetch(event.request).then((response) => {
                    // 檢查是否為有效響應
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // 複製響應
                    const responseToCache = response.clone();
                    
                    // 將響應添加到緩存
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
            .catch(() => {
                // 如果離線且沒有緩存，返回離線頁面
                return new Response('離線狀態', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            })
    );
});

// 更新 Service Worker
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
});
