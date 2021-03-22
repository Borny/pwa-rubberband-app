const staticVersion = `static-006`;
const dynamicVersion = `dynamic-002`;

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing service worker ...', event);
  event.waitUntil(
    caches.open(staticVersion)
      .then(cache => {
        console.log('[Service Worker] Precaching app shell (index.html,css.js...) ...', event);
        cache.addAll([
          '/',
          '/index.html',
          '/js.d818e0ef.css',
          '/js.d818e0ef.js',
          '/favicon.26242483.ico',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
          'https://fonts.googleapis.com/icon?family=Material+Icons'
        ]);
      })
  )
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating service worker ...', event);
  event.waitUntil(
    caches.keys()
    .then(keyList=>{
      console.log(keyList)
      return Promise.all(
        keyList.map(key => {
          if(key !== staticVersion && key !== dynamicVersion){
            console.log('removed cache : ', key);
            caches.delete(key);
          }
        })
      )
    })
  )
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if(response){
        return response}
      else {
        return fetch(event.request)
          .then(serverRes => {
            return caches.open(dynamicVersion)
              .then(cache => {
                cache.put(event.request.url, serverRes.clone())
                return serverRes;
              })
          })
          .catch(err => {console.log(err)})
      } 
    }) 
  )
});
