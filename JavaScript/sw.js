const archivosCache = [
    '/',
    '/index.html',
    '/favoritos.html',
    '/CSS/styles.css',
    '/JavaScript/favoritos.js',
    '/JavaScript/main.js',
    '/JavaScript/sw.js',
    '/Images',
    '/manifest.json'
];

self.addEventListener('install', evento => {
    const cache = caches.open('cache-productos').then( cache => {
       return cache.addAll(archivosCache);
    });
    evento.waitUntil(cache);
});

self.addEventListener('fetch', event => {

    const respuesta = fetch(event.request).then( respuestaNetwork => {
        return caches.open( 'cache-productos' ).then(  cache => {
            cache.put(  event.request, respuestaNetwork.clone() );
            return respuestaNetwork;
        } )
    }).catch( error => {
        return caches.match( event.request)
    });
   
    event.respondWith(respuesta);
});

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('cache-productos')
        .then((cache) => {
          console.log('El caché funciona');
          return cache.addAll(archivosCache);
        })
        .catch((error) => {
          console.error('Error al almacenar en caché', error);
        })
    );
});