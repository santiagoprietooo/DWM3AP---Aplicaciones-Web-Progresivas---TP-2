navigator.serviceWorker.register('/JavaScript/sw.js');
if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('/JavaScript/sw.js');
};

document.addEventListener('DOMContentLoaded', function(){
    const buscarInput = document.getElementById('buscarInput');
    const buscarButton = document.getElementById('buscarButton');
    const mostrarProductos = document.getElementById('mostrarProductos');
    const productoModal = document.getElementById('productoModal');
    const modalDetalles = document.getElementById('modalDetalles');
    const closeBtn = document.querySelector('.close');

    mostrarProductosIniciales();

    buscarButton.addEventListener('click', function() {
        const buscarTermino = buscarInput.value.trim();
        if (buscarTermino === '') {
            alert('No se ha ingresado ningún término.');
            return;            
        }

        buscarProducto(buscarTermino);
    });

    function buscarProducto(producto){
        const apiDummy = `https://dummyjson.com/products/search?q=${producto}`;
        
        fetch(apiDummy)
        .then(res => {
            if(!res.ok){
                throw new Error('La solicitud FALLÓ.');
            }
            return res.json();
        })
        .then(data =>{
            if(data.products.length > 0){
                listaProductos(data.products);
            }else{
                mostrarProductos.innerHTML = '<p><strong>No se ha encontrado el producto.</strong></p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarProductos.innerHTML = '<p>Ocurrió un error al realizar la búsqueda.</p>';
        });
    }

    function mostrarProductosIniciales() {
        const apiDummy = 'https://dummyjson.com/products';
        
        fetch(apiDummy)
        .then(res => {
            if(!res.ok){
                throw new Error('La solicitud FALLÓ.');
            }
            return res.json();
        })
        .then(data =>{
            listaProductos(data.products);
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarProductos.innerHTML = '<p>Ocurrió un error al cargar los productos iniciales.</p>';
        });
    }
    
    function listaProductos(productos) {
        mostrarProductos.innerHTML = '';
    
        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            productoDiv.innerHTML = `
            <img src="${producto.thumbnail}" alt="${producto.title}">
            <h3>${producto.title}</h3>
            <small>Categoría: <a href="#">${producto.category}</a></small>
            <p><strong>Unidades disponibles: </strong>${producto.stock}</p>
            <hr>
            <h4>US$${producto.price}</h4>

            <div class="botonesProduct">
                <button class="detallesProducto" data-id="${producto.id}"><strong>Ver Detalles</strong></button>
                
                <div>
                    <button class="agregarFavorito" data-id="${producto.id}"><i class="fa-solid fa-heart"></i></button>
                </div> 
            </div>
            `;
            mostrarProductos.appendChild(productoDiv);
        });

        document.querySelectorAll('.detallesProducto').forEach(button => {
            button.addEventListener('click', function() {
                const productoId = this.getAttribute('data-id');
                mostrarDetallesProducto(productoId);
            });
        });

        document.querySelectorAll('.agregarFavorito').forEach(button => {
            button.addEventListener('click', function() {
                const productoId = this.getAttribute('data-id');
                agregarAFavoritos(productoId);
            });
        });
    }

    function mostrarDetallesProducto(productoId) {
        const apiDummy = `https://dummyjson.com/products/${productoId}`;
        
        fetch(apiDummy)
        .then(res => {
            if(!res.ok){
                throw new Error('La solicitud FALLÓ.');
            }
            return res.json();
        })
        .then(producto => {
            modalDetalles.innerHTML = `
                <img src="${producto.thumbnail}" alt="${producto.title}">
                <div class="modal-flex">
                    <h2>${producto.title}</h2>
                    <p><strong>Descripción:</strong> ${producto.description}</p>
                    <p><strong>Categoría:</strong> ${producto.category}</p>
                    <p><strong>Unidades disponibles:</strong> ${producto.stock}</p>

                    <div class="modal-final">
                        <p style="font-size: 1.4rem;"><strong>Precio:</strong> <span style="color:green; font-weight:700;">US$${producto.price}</span></p>
                        <button class="agregarFavorito" data-id="${producto.id}"><i class="fa-solid fa-heart"></i></button>
                    </div>
                </div>
            `;
            productoModal.style.display = 'block';

            document.querySelector('.agregarFavorito').addEventListener('click', function() {
                agregarAFavoritos(producto.id);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            modalDetalles.innerHTML = '<p>Ocurrió un error al cargar los detalles del producto.</p>';
        });
    }

    function agregarAFavoritos(productoId) {
        const apiDummy = `https://dummyjson.com/products/${productoId}`;
    
        fetch(apiDummy)
        .then(res => res.json())
        .then(producto => {
            if (producto && producto.id && producto.title && producto.thumbnail && producto.price) {
                let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
                if (!favoritos.some(fav => fav.id === producto.id)) {
                    favoritos.push(producto);
                    localStorage.setItem('favoritos', JSON.stringify(favoritos));
                    alert('Producto agregado a favoritos');
                } else {
                    alert('El producto ya está en favoritos');
                }
            } else {
                console.error('Producto inválido:', producto);
            }
        })
        .catch(error => console.error('Error:', error));
    }
    

    closeBtn.addEventListener('click', function() {
        productoModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === productoModal) {
            productoModal.style.display = 'none';
        }
    });
});