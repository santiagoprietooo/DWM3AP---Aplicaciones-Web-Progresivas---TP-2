const archivosApp = [
    '/',
    '/index.html',
    '/favoritos.html',
    '/CSS/styles.css',
    '/JavaScript/main.js',
    '/JavaScript/favoritos.js',
    '/JavaScript/sw.js',
    '/Images/icons',
    '/Images/lupa.png',
    '/Images/tienda.png',
    '/manifest.json',
    'https://dummyjson.com/products',
    'https://kit.fontawesome.com/e21be378af.js'
];

caches.open('productos-guardados');
caches.open('productos-guardados').then( cache =>{
    cache.addAll([
        '/',
        '/index.html',
        '/favoritos.html',
        '/CSS/styles.css',
        '/JavaScript/main.js',
        '/JavaScript/favoritos.js',
        '/JavaScript/sw.js',
        '/Images/icons',
        '/Images/lupa.png',
        '/Images/tienda.png',
        '/manifest.json',
        'https://dummyjson.com/products',
        'https://kit.fontawesome.com/e21be378af.js'
    ])
})
caches.open('productos-guardados').then( cache =>{
    cache.put('Styles.css', new Response('styles.css'))
})

self.addEventListener('install', evento => {
    const cache = caches.open('productos-guardados').then( cache => {
       return cache.addAll(archivosApp);
    });
    evento.waitUntil(cache);
});

self.addEventListener('fetch', event => {

    const respuesta = fetch(event.request).then( respuestaNetwork => {
        return caches.open( 'productos-guardados' ).then(  cache => {
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
      caches.open('productos-guardados')
        .then((cache) => {
          console.log('El caché funciona');
          return cache.addAll(archivosApp);
        })
        .catch((error) => {
          console.error('Error al almacenar en caché', error);
        })
    );
});