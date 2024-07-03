const archivosApp = [
    '/',
    '/index.html',
    '/favoritos.html',
    '/CSS/styles.css',
    '/JavaScript/main.js',
    '/JavaScript/favoritos.js',
    '/sw.js',
    '/Images/icons',
    '/Images/lupa.png',
    '/Images/tienda.png',
    '/manifest.json',
    'https://dummyjson.com/products',
    'https://kit.fontawesome.com/e21be378af.js'
];

self.addEventListener('install', evento => {
    evento.waitUntil(
        caches.open('productos-guardados').then(cache => {
            return cache.addAll(archivosApp);
        }).catch(error => {
            console.error('Error al almacenar en caché', error);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).then(respuestaNetwork => {
            return caches.open('productos-guardados').then(cache => {
                cache.put(event.request, respuestaNetwork.clone());
                return respuestaNetwork;
            });
        }).catch(error => {
            return caches.match(event.request);
        })
    );
});