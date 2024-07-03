if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/JavaScript/sw.js')
    .then(res => {
        console.log('Service Worker registrado:', res);
    })
    .catch(error => {
        console.error('Error al registrar el Service Worker:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const mostrarFavoritos = document.getElementById('mostrarFavoritos');
    cargarFavoritos();

    function cargarFavoritos() {
        let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        mostrarFavoritos.innerHTML = '';

        favoritos = favoritos.filter(producto => producto && producto.id && producto.title && producto.thumbnail && producto.price);

        if (favoritos.length === 0) {
            mostrarFavoritos.innerHTML = '<p style="font-size: 30px; text-align: center; font-weight: 700;">No hay productos en favoritos.</p>';
            return;
        }

        favoritos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            productoDiv.innerHTML = `
                <img src="${producto.thumbnail}" alt="${producto.title}">
                <h3>${producto.title}</h3>
                <small>Categoría: <a href="#">${producto.category}</a></small>
                <hr>
                <p>Unidades disponibles: ${producto.stock}</p>
                <h4>US$${producto.price}</h4>

                <div class="botonesProduct">
                    <button class="eliminarFavorito" data-id="${producto.id}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;
            mostrarFavoritos.appendChild(productoDiv);
        });

        document.querySelectorAll('.eliminarFavorito').forEach(button => {
            button.addEventListener('click', function() {
                const productoId = this.getAttribute('data-id');
                eliminarDeFavoritos(productoId);
            });
        });
    }

    function eliminarDeFavoritos(productoId) {
        let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        favoritos = favoritos.filter(producto => producto.id !== parseInt(productoId));
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        cargarFavoritos();
    }
});