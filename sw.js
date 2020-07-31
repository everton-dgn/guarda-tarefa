// “powered by ecomplato carros”

const CACHE_NAME = 'webapp_tarefa_cache'
const CACHING_DURATION = 15 * 600
// const BLACK_LIST = /(google|gstatic)/
const STATIC_FILES = [
  './',
  './index.html',
  './script.js',
  './css/style.css',
  './css/themes/Dark1.css',
  'https://fonts.googleapis.com/css?family=Orbitron:400,500,600,700,800,900&display=swap'
];

self.addEventListener('install', event => {
  console.log('[SW] Instalando...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then( cache => {
        console.log('[SW] Pré-cacheando arquivos estáticos');
        cache.addAll(STATIC_FILES);
      })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event
  // if (request.url.match(BLACK_LIST) || request.method === "POST") {
  //   console.log('Voltou...', event.request.url);
  //   return
  // }
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(request).then(response => {
        if (response && response.status >= 200 && response.status <= 299) {
          const expirationDate = Date.parse(response.headers.get('sw-cache-expires'))
          const now = new Date()
          if (expirationDate > now) {
            return response
          }
        }
        return fetch(request.url, { cache: 'no-cache' }).then(liveResponse => {
          const expires = new Date()
          expires.setSeconds(expires.getSeconds() + CACHING_DURATION)
          const cachedResponseFields = {
            status: liveResponse.status,
            statusText: liveResponse.statusText,
            headers: {
              'sw-cache-expires': expires.toUTCString()
            },
          }
          liveResponse.headers.forEach((header, headerName) => {
            cachedResponseFields.headers[headerName] = header
          })
          const returnedResponse = liveResponse.clone()
          return liveResponse.blob().then(body => {
            cache.put(request, new Response(body, cachedResponseFields))
            return returnedResponse
          })
        })
      })
    })
  )
})