const CACHE_NAME = 'V2'

const self = this
// install SW
self.addEventListener('install', (event) => {
    // console.log('Service worker: Installed!');    
})
//Listen to request
self.addEventListener('fetch', (event) => {
    // console.log('Service worker: Fetched!');

    event.respondWith(
        fetch(event.request)
        .then(res => {
            //Make copy of response
            const resClone = res.clone()
            // Opne cache
            caches.open(CACHE_NAME)
                .then(cache => {
                    // check if request is made by chrome extensions or web page
                    // if request is made for web page url must contains http.
                    if (!/^https?:$/i.test(new URL(event.request.url).protocol)) return;
                    //Add response to cache
                    cache.put(event.request, resClone)
                })
            return res
        })
        .catch((err) => caches.match(event.request).then(res => res))
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