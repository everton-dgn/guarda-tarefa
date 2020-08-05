// “powered by ecomplato carros”
const BASE_URL = 'http://localhost/guarda-tarefa'; //TODO : Desenvolvimento
const BASE_URL = 'https://querocriarsite.com/projetos/tarefas/'; //TODO : Produção
const CACHE_NAME = 'guardatarefas_v0';
const STATIC_FILES = [
  `${BASE_URL}/`,
  `${BASE_URL}/index.html`,
  `${BASE_URL}/script.js`,
  `${BASE_URL}/css/style.css`,
  `${BASE_URL}/css/themes/Dark1.css`,
  `${BASE_URL}/css/themes/Dark2.css`,
  `${BASE_URL}/css/themes/Dark3.css`,
  `${BASE_URL}/css/themes/Dark4.css`,
  `${BASE_URL}/css/themes/Dark5.css`,
  `${BASE_URL}/css/themes/Light1.css`,
  `${BASE_URL}/css/themes/Light2.css`,
  `${BASE_URL}/css/themes/Light3.css`,
  `${BASE_URL}/css/themes/Light4.css`,
  `${BASE_URL}/css/themes/Light5.css`,
  `${BASE_URL}/images/og/logo.jpg`,
  'https://fonts.googleapis.com/css?family=Orbitron:400,500,600,700,800,900&display=swap'
];

self.addEventListener('install', event => {
  console.log('[SW] Instalando...',event);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then( cache => {
        console.log('[SW] Pré-cacheando arquivos estáticos');
        return cache.addAll(STATIC_FILES)
          .then( result => {
            console.log('Cache OK', result)
          })
          .catch( erro => {
            console.log('Não cacheou', erro)
          });
      })
  );
});

self.addEventListener('active', event => {
  console.log('[SW] Ativando ...', event);

  event.waitUntil(
    caches.keys()
      .then( keyList => {
        return Promise.all(keyList.map( key => {
          //Checando se o nome do cache é diferente do nome da versão atual
          if(key !== CACHE_NAME){ 
            console.log('[SW] Removando cache antigo', key);
            caches.delete(key);
          } 
        }));
      })
  );

  //Aplica as atividades executadas pelo SW no primeiro carregamento da página
  return self.clients.claim();
}); 

self.addEventListener('fetch', event => {
  
  let { request } = event;

  if(STATIC_FILES.includes(request.url)){
    console.log('Fetching do pre-caching',request.url);
    event.respondWith(  
      caches.match(request)
    );
  }
  else {
    console.log('Fetching do dynamic-caching', request.url);
    event.respondWith(
      caches.match(request)
      .then( response => {
        if(response)
          return response;
        else {
          return fetch(request)
            .then( res => {
              return caches.open(CACHE_NAME)
                .then( cache => {
                  cache.put(request.url, res.clone());
                  return res;
                });
            })
            .catch( error =>{
              console.log('[SW] Cache não resolveu');
            });
        }
      })
    )
  }
  
})