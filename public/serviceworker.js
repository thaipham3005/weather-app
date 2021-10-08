const CACHE_NAME = 'V1'
const UrlsToCache = [
    'index.html',
    'offline.html',

]

const self = this
// install SW
self.addEventListener('install', (event) => {
    // console.log('Service worker: Installed!');

    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache');
            return cache.addAll(UrlsToCache)
        })
    )
})
//Listen to request
self.addEventListener('fetch', (event) => {
    // console.log('Service worker: Fetched!');
    event.respondWith(
        fetch(event.request)
        .catch(() => caches.match(event.request))
    )
})

// Activate SW
self.addEventListener('activate', (event) => {
    const cacheWhitelist = []
    cacheWhitelist.push(CACHE_NAME)
    // console.log('Service worker: Clearing old caches!');

    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            // eslint-disable-next-line array-callback-return
            cacheNames.map(cache => {
                if (!cacheWhitelist.includes(cache)) {
                    return caches.delete(cache)
                }
            })
        ))
    )
})