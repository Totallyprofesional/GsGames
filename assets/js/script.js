/* Variables globales */
let productos = []; 
let carrito = []; 
let productoActual = null; 

/* Cargar productos desde JSON local */
function cargarProductos() {
    fetch('assets/js/productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json();
        })
        .then(data => {
            productos = data;
            mostrarProductos(productos);
        })
        .catch(error => {
            // Mensaje de error
            console.error('Error al cargar productos:', error);
            document.getElementById('contenedor-productos').innerHTML =
                '<p>No se pudieron cargar los productos. Intenta más tarde.</p>';
        });
}

/* Mostrar productos en el catálogo */
function mostrarProductos(lista) {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = ''; 

    lista.forEach(producto => {
        const columna = document.createElement('div');
        columna.classList.add('col-md-4', 'mb-4');
        columna.innerHTML = `
            <div class="card">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">$${producto.precio}</p>
                    <button class="btn btn-primary btn-ver-detalles"
                        data-id="${producto.id}"
                        data-bs-toggle="modal"
                        data-bs-target="#modalDetalle">
                        Ver Detalles
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(columna);
    });
}

/* Mostrars detalle del producto clickeado */
function configurarModal() {
    const contenedor = document.getElementById('contenedor-productos');

    // Evento click: detecta clickeo en "Ver Detalles"
    contenedor.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-ver-detalles')) {
            const id = e.target.dataset.id;
            productoActual = productos.find(p => p.id == id);

            // Llena el modal con los datos del producto
            document.getElementById('modalDetalleLabel').textContent = productoActual.nombre;
            document.getElementById('modal-img').src = productoActual.imagen;
            document.getElementById('modal-descripcion').textContent = productoActual.descripcion;
            document.getElementById('modal-precio').textContent = `Precio: $${productoActual.precio}`;
        }
    });

    // Botón "Agregar al Carrito" dentro del modal
    document.getElementById('btn-agregar-modal').addEventListener('click', () => {
        if (productoActual) {
            agregarAlCarrito(productoActual);
        }
    });
}

/* Carrito: agregar producto y mostrar resumen */
function agregarAlCarrito(producto) {
    carrito.push(producto);
    actualizarResumenCarrito();
}

function actualizarResumenCarrito() {
    const resumen = document.getElementById('resumen-carrito');
    const total = carrito.reduce((suma, p) => suma + p.precio, 0);
    resumen.textContent = `Carrito: ${carrito.length} producto(s) - Total: $${total}`;
}

/* Búsqueda: filtra el catálogo por nombre */
function configurarBusqueda() {
    const formulario = document.getElementById('form-busqueda');

    formulario.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const texto = document.getElementById('input-busqueda').value.toLowerCase().trim();
        const resultado = productos.filter(p => p.nombre.toLowerCase().includes(texto));
        mostrarProductos(resultado);
    });
}

/* Inicialización */
cargarProductos();
configurarModal();
configurarBusqueda();
