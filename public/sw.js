const staticVersion = `static-024`
const DYNAMIC_CACHE = `dynamic-010`
const STATIC_FILES = ['/index.html',
  '/pages/offline.html',
  '/js.d818e0ef.css',
  '/main.847ea5f6.css',
  '/js.d818e0ef.js',
  '/main.1f19ae8e.js',
  '/favicon.26242483.ico',
  '/manifest.webmanifest'
]

// // INSTALL
console.log('[Service Worker]')
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing service worker ...', event)
  event.waitUntil(
    caches.open(staticVersion).then((cache) => {
      console.log(
        '[Service Worker] Precaching app shell (index.html,css.js...) ...',
        event
      )
      cache.addAll(STATIC_FILES)
    })
  )
})

// ACTIVATE
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating service worker ...', event)
  event.waitUntil(
    caches.keys().then((keyList) => {
      console.log(keyList)
      return Promise.all(
        keyList.map((key) => {
          if (key !== staticVersion && key !== DYNAMIC_CACHE) {
            console.log('removed cache : ', key)
            caches.delete(key)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       if (response) {
//         return response;
//       } else {
//         return fetch(event.request)
//           .then((serverRes) => {
//             return caches.open(DYNAMIC_CACHE).then((cache) => {
//               cache.put(event.request.url, serverRes.clone());
//               return serverRes;
//             });
//           })
//           .catch((err) => {
//             console.log('fetch error :', err);
//             return caches.open(staticVersion).then((cache) => {
//               return cache.match('/pages/offline.html');
//             });
//           });
//       }
//     })
//   );
// });

let requestNumber = 0

self.addEventListener('fetch', (event) => {
  const URL = 'https://httpbin.org/get'

  if (event.request.url.indexOf(URL) > -1) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return fetch(event.request)
            .then((res) => {
              cache.put(event.request, res.clone())
              return res
            })
        })
    )
  } else if (STATIC_FILES.some(file =>
    file === event.request.url)) {
    // console.log(requestNumber)
    // requestNumber++

    event.respondWith(
      caches.match(event.request)
    )
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response
          } else {
            return fetch(event.request)
              .then(res => {
                return caches.open(DYNAMIC_CACHE)
                  .then(cache => {
                    cache.put(event.request.url, res.clone())
                    return res
                  })
              })
              .catch(err => {
                return caches.open(staticVersion)
                  .then(cache => {
                    if (event.request.headers.get('accept').includes('text/html')) {
                      return cache.match('/pages/offline.html')
                    }
                  })
              })
          }
        })
    )
  }
})
