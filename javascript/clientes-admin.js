// Funcionalidad para administracion de clientes

document.addEventListener('DOMContentLoaded', function() {
    loadClientes();
    setupSearch();
});

// Funcion para cargar clientes desde la base de datos
function loadClientes() {
    // Cargar los datos desde la API/BD
    // Datos de ejemplo
    const clientes = [
        {
            id: 1,
            nombre: 'Juan',
            apellido: 'Pérez',
            email: 'juan.perez@email.com',
            telefono: '+54 9 1234-5678',
            plan: 'Plan Premium',
            estado: 'Activo'
        },
        {
            id: 2,
            nombre: 'María',
            apellido: 'González',
            email: 'maria.gonzalez@email.com',
            telefono: '+54 9 2345-6789',
            plan: 'Plan Básico',
            estado: 'Activo'
        },
        {
            id: 3,
            nombre: 'Carlos',
            apellido: 'López',
            email: 'carlos.lopez@email.com',
            telefono: '+54 9 3456-7890',
            plan: 'Plan Premium',
            estado: 'Inactivo'
        },
        {
            id: 4,
            nombre: 'Ana',
            apellido: 'Martínez',
            email: 'ana.martinez@email.com',
            telefono: '+54 9 4567-8901',
            plan: 'Plan Básico',
            estado: 'Pendiente'
        }
    ];

    renderClientesTable(clientes);
}

// Funcion para renderizar la tabla de clientes
function renderClientesTable(clientes) {
    const tbody = document.getElementById('clientesTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    clientes.forEach(cliente => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellido}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono}</td>
            <td><a href="#" class="table-link" onclick="verPlan(${cliente.id})">${cliente.plan}</a></td>
            <td><span class="status-${cliente.estado.toLowerCase()}">${cliente.estado}</span></td>
            <td>
                <div class="action-buttons-table">
                    <button class="btn-view" onclick="verCliente(${cliente.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-edit" onclick="editarCliente(${cliente.id})" title="Editar">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="eliminarCliente(${cliente.id})" title="Eliminar">
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
    const searchInput = document.getElementById('searchClientes');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterClientes(searchTerm);
        });
    }
}

// Funcion para filtrar clientes
function filterClientes(searchTerm) {
    // Implementar la logica de filtrado real
    // Por ahora recargar todos los clientes
    loadClientes();
}

// Funcion para buscar clientes
function buscarClientes() {
    const searchInput = document.getElementById('searchClientes');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        showNotification(`Buscando clientes con: "${searchTerm}"`, 'info');
        // Implementar la busqueda real
    } else {
        showNotification('Por favor ingrese un término de búsqueda', 'error');
    }
}

// Funcion para agregar nuevo cliente
function agregarCliente() {
    showNotification('Redirigiendo al formulario de nuevo cliente...', 'info');
    
    // Redirigir al formulario de creacion
    // window.location.href = 'cliente-nuevo.html';
    
    // Por ahora se muestra un modal de ejemplo
    setTimeout(() => {
        showNotification('Funcionalidad de agregar cliente en desarrollo', 'info');
    }, 1000);
}

// Funcion para ver detalles del cliente
function verCliente(id) {
    showNotification(`Viendo detalles del cliente ID: ${id}`, 'info');
    
    // Redirigir a la pagina de detalles
    // window.location.href = `cliente-detalle.html?id=${id}`;
}

// Funcion para editar cliente
function editarCliente(id) {
    showNotification(`Editando cliente ID: ${id}`, 'info');
    
    // Redirigir al formulario de edicion
    // window.location.href = `cliente-editar.html?id=${id}`;
}

// Funcion para eliminar cliente
function eliminarCliente(id) {
    confirmAction(
        '¿Está seguro?',
        '¿Desea eliminar este cliente? Esta acción no se puede deshacer.',
        'Sí, eliminar',
        'Cancelar'
    ).then((result) => {
        if (result.isConfirmed) {
            showNotification(`Eliminando cliente ID: ${id}`, 'info');
            
            // Implementar la eliminacion real
            setTimeout(() => {
                showNotification('Cliente eliminado correctamente', 'success');
                loadClientes(); // Recargar la tabla
            }, 1000);
        }
    });
}

// Funcion para ver detalles del plan
function verPlan(id) {
    showNotification(`Viendo detalles del plan del cliente ID: ${id}`, 'info');
    
    // Redirigir a la pagina de detalles del plan
    // window.location.href = `plan-detalle.html?clienteId=${id}`;
}

// Funcion para exportar datos
function exportarClientes() {
    showNotification('Exportando datos de clientes...', 'info');
    
    // Implementar la exportacion (CSV, Excel, etc.)
    setTimeout(() => {
        showNotification('Datos exportados correctamente', 'success');
    }, 1500);
}

// Funcion para importar datos
function importarClientes() {
    showNotification('Funcionalidad de importación en desarrollo', 'info');
    
    // Implementar la importacion desde archivo
}

// Funcion para mostrar estadisticas
function mostrarEstadisticas() {
    showNotification('Mostrando estadísticas de clientes...', 'info');
    
    // Mostrar gráficos y estadísticas
    setTimeout(() => {
        showNotification('Estadísticas cargadas', 'success');
    }, 1000);
}
