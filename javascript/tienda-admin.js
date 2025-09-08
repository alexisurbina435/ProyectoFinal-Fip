// Funcionalidad para administracion de tienda

document.addEventListener('DOMContentLoaded', function() {
    loadProductos();
    setupSearch();
});

// Funcion para cargar productos desde la base de datos
function loadProductos() {
    // Cargar los datos desde la API/BD
    // Datos de ejemplo
    const productos = [
        {
            id: 1,
            nombre: 'Proteína Whey',
            descripcion: 'Proteína de suero de leche de alta calidad',
            precio: '$15.99',
            stock: 45,
            categoria: 'Suplementos',
            imagen: 'proteina-whey.jpg',
            estado: 'Activo'
        },
        {
            id: 2,
            nombre: 'Cinturón de Gimnasio',
            descripcion: 'Cinturón de cuero para levantamiento de pesas',
            precio: '$29.99',
            stock: 12,
            categoria: 'Equipamiento',
            imagen: 'cinturon-gimnasio.jpg',
            estado: 'Activo'
        },
        {
            id: 3,
            nombre: 'Botella de Agua',
            descripcion: 'Botella deportiva de 1L con boquilla',
            precio: '$12.99',
            stock: 78,
            categoria: 'Accesorios',
            imagen: 'botella-agua.jpg',
            estado: 'Activo'
        },
        {
            id: 4,
            nombre: 'Creatina Monohidratada',
            descripcion: 'Creatina pura para ganancia de fuerza',
            precio: '$18.99',
            stock: 23,
            categoria: 'Suplementos',
            imagen: 'creatina.jpg',
            estado: 'Activo'
        },
        {
            id: 5,
            nombre: 'Guantes de Gimnasio',
            descripcion: 'Guantes con protección para callos',
            precio: '$24.99',
            stock: 0,
            categoria: 'Equipamiento',
            imagen: 'guantes-gimnasio.jpg',
            estado: 'Sin Stock'
        }
    ];

    renderProductosTable(productos);
}

// Funcion para renderizar la tabla de productos
function renderProductosTable(productos) {
    const tbody = document.getElementById('productosTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    productos.forEach(producto => {
        const row = document.createElement('tr');
        
        // Determinar la clase de estado segun el stock
        // Cambio el nombre de los estado(Activo, Inactivo, Pendiente) para que esten todos iguales en las otras tablas, <revisar>
        let estadoClass = 'status-activo';
        if (producto.stock === 0) {
            estadoClass = 'status-inactivo';
        } else if (producto.stock < 10) {
            estadoClass = 'status-pendiente';
        }
        
        row.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td><strong>${producto.precio}</strong></td>
            <td><span class="${producto.stock === 0 ? 'status-inactive' : 'status-active'}">${producto.stock}</span></td>
            <td><a href="#" class="table-link" onclick="verCategoria('${producto.categoria}')">${producto.categoria}</a></td>
            <td><a href="#" class="table-link" onclick="verImagenProducto(${producto.id})">Ver imagen</a></td>
            <td><span class="${estadoClass}">${producto.estado}</span></td>
            <td>
                <div class="action-buttons-table">
                    <button class="btn-view" onclick="verProducto(${producto.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-edit" onclick="editarProducto(${producto.id})" title="Editar">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="eliminarProducto(${producto.id})" title="Eliminar">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Funcion para configurar la busqueda
function setupSearch() {
    const searchInput = document.getElementById('searchProductos');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterProductos(searchTerm);
        });
    }
}

// Funcion para filtrar productos
function filterProductos(searchTerm) {
    // Implementar la logica de filtrado real
    // Por ahora cargamos todos los productos
    loadProductos();
}

// Funcion para buscar productos
function buscarProductos() {
    const searchInput = document.getElementById('searchProductos');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        showNotification(`Buscando productos con: "${searchTerm}"`, 'info');
        // Implementar la busqueda real
    } else {
        showNotification('Por favor ingrese un término de búsqueda', 'error');
    }
}

// Funcion para agregar nuevo producto
function agregarProducto() {
    showNotification('Redirigiendo al formulario de nuevo producto...', 'info');
    
    // Redirigir al formulario de creacion
    // window.location.href = 'producto-nuevo.html';
    
    // Por ahora mostramos un modal de ejemplo
    setTimeout(() => {
        showNotification('Funcionalidad de agregar producto en desarrollo', 'info');
    }, 1000);
}

// Funcion para ver detalles del producto
function verProducto(id) {
    showNotification(`Viendo detalles del producto ID: ${id}`, 'info');
    
    // Redirigir a la pagina de detalles
    // window.location.href = `producto-detalle.html?id=${id}`;
}

// Funcion para editar producto
function editarProducto(id) {
    showNotification(`Editando producto ID: ${id}`, 'info');
    
    // Redirigir al formulario de edicion
    // window.location.href = `producto-editar.html?id=${id}`;
}

// Funcion para eliminar producto
function eliminarProducto(id) {
    confirmAction(
        '¿Está seguro?',
        '¿Desea eliminar este producto? Esta acción no se puede deshacer.',
        'Sí, eliminar',
        'Cancelar'
    ).then((result) => {
        if (result.isConfirmed) {
            showNotification(`Eliminando producto ID: ${id}`, 'info');
            
            // Implementar la eliminacion real
            setTimeout(() => {
                showNotification('Producto eliminado correctamente', 'success');
                loadProductos(); // Recargar la tabla
            }, 1000);
        }
    });
}

// Funcion para ver imagen del producto
function verImagenProducto(id) {
    showNotification(`Viendo imagen del producto ID: ${id}`, 'info');
    
    // Mostrar un modal con la imagen
    // o redirigir a una pagina de visualizacion
}

// Funcion para ver productos de una categoria
function verCategoria(categoria) {
    showNotification(`Viendo productos de la categoría: ${categoria}`, 'info');
    
    // Filtrar los productos por categoria
    // o redirigir a una pagina de categoria
}

// Funcion para ajustar stock
function ajustarStock(id, cantidad) {
    showNotification(`Ajustando stock del producto ID: ${id}`, 'info');
    
    // Mostrar un modal para ingresar la nueva cantidad
    setTimeout(() => {
        showNotification('Stock ajustado correctamente', 'success');
        loadProductos(); // Recargar la tabla
    }, 1000);
}

// Funcion para activar/desactivar producto
function toggleProducto(id, estadoActual) {
    const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo';
    showNotification(`Cambiando estado del producto ID: ${id} a ${nuevoEstado}`, 'info');
    
    // Implementar el cambio de estado
    setTimeout(() => {
        showNotification(`Estado del producto cambiado a ${nuevoEstado}`, 'success');
        loadProductos(); // Recargar la tabla
    }, 1000);
}

// Funcion para subir nueva imagen
function subirImagenProducto(id) {
    showNotification(`Subiendo nueva imagen para producto ID: ${id}`, 'info');
    
    // Mostrar un input de archivo
    setTimeout(() => {
        showNotification('Funcionalidad de subida de imagen en desarrollo', 'info');
    }, 1000);
}

// Funcion para duplicar producto
function duplicarProducto(id) {
    showNotification(`Duplicando producto ID: ${id}`, 'info');
    
    // Implementar la duplicacion
    setTimeout(() => {
        showNotification('Producto duplicado correctamente', 'success');
    }, 1000);
}

// Funcion para ver historial de ventas
function verHistorialVentas(id) {
    showNotification(`Viendo historial de ventas del producto ID: ${id}`, 'info');
    
    // Mostrar las ventas del producto
    setTimeout(() => {
        showNotification('Historial de ventas cargado', 'success');
    }, 1000);
}

// Funcion para exportar catalogo
function exportarCatalogo() {
    showNotification('Exportando catálogo de productos...', 'info');
    
    // Implementar la exportacion (CSV, Excel, etc.)
    setTimeout(() => {
        showNotification('Catálogo exportado correctamente', 'success');
    }, 1500);
}

// Funcion para importar productos
function importarProductos() {
    showNotification('Funcionalidad de importación en desarrollo', 'info');
    
    // Implementar la importacion desde archivo
}

// Funcion para ver estadisticas de ventas
function verEstadisticasVentas() {
    showNotification('Mostrando estadísticas de ventas...', 'info');
    
    // Mostrar gráficos y métricas de ventas
    setTimeout(() => {
        showNotification('Estadísticas cargadas', 'success');
    }, 1000);
}

// Funcion para gestionar categorias
function gestionarCategorias() {
    showNotification('Redirigiendo a gestión de categorías...', 'info');
    
    // Redirigir a la pagina de gestion de categorias
    setTimeout(() => {
        showNotification('Funcionalidad de gestión de categorías en desarrollo', 'info');
    }, 1000);
}

// Funcion para ver productos con bajo stock
function verProductosBajoStock() {
    showNotification('Mostrando productos con bajo stock...', 'info');
    
    // Filtrar los productos con stock menor a 10
    setTimeout(() => {
        showNotification('Productos con bajo stock filtrados', 'success');
    }, 1000);
}
