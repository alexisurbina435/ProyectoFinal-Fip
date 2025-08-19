// Funcionalidad para administracion de rutinas

document.addEventListener('DOMContentLoaded', function() {
    loadRutinas();
    setupSearch();
});

// Funcion para cargar rutinas desde la base de datos
function loadRutinas() {
    // Cargar los datos desde la API/BD
    // Datos de ejemplo
    const rutinas = [
        {
            id: 1,
            nombre: 'Rutina Principiante',
            descripcion: 'Rutina básica para personas que recién comienzan',
            nivel: 'Principiante',
            duracion: '4 semanas',
            ejercicios: 8,
            estado: 'Activo'
        },
        {
            id: 2,
            nombre: 'Rutina Intermedia',
            descripcion: 'Rutina para personas con experiencia moderada',
            nivel: 'Intermedio',
            duracion: '6 semanas',
            ejercicios: 12,
            estado: 'Activo'
        },
        {
            id: 3,
            nombre: 'Rutina Avanzada',
            descripcion: 'Rutina intensiva para atletas experimentados',
            nivel: 'Avanzado',
            duracion: '8 semanas',
            ejercicios: 15,
            estado: 'Activo'
        },
        {
            id: 4,
            nombre: 'Rutina de Recuperación',
            descripcion: 'Rutina suave para recuperación muscular',
            nivel: 'Todos los niveles',
            duracion: '2 semanas',
            ejercicios: 6,
            estado: 'Inactivo'
        }
    ];

    renderRutinasTable(rutinas);
}

// Funcion para renderizar la tabla de rutinas
function renderRutinasTable(rutinas) {
    const tbody = document.getElementById('rutinasTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    rutinas.forEach(rutina => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${rutina.id}</td>
            <td>${rutina.nombre}</td>
            <td>${rutina.descripcion}</td>
            <td><span class="status-${rutina.nivel.toLowerCase()}">${rutina.nivel}</span></td>
            <td>${rutina.duracion}</td>
            <td><a href="#" class="table-link" onclick="verEjercicios(${rutina.id})">${rutina.ejercicios} ejercicios</a></td>
            <td><span class="status-${rutina.estado.toLowerCase()}">${rutina.estado}</span></td>
            <td>
                <div class="action-buttons-table">
                    <button class="btn-view" onclick="verRutina(${rutina.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-edit" onclick="editarRutina(${rutina.id})" title="Editar">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="eliminarRutina(${rutina.id})" title="Eliminar">
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
    const searchInput = document.getElementById('searchRutinas');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterRutinas(searchTerm);
        });
    }
}

// Funcion para filtrar rutinas
function filterRutinas(searchTerm) {
    // Implementar la logica de filtrado real
    // Por ahora recargamos todas las rutinas
    loadRutinas();
}

// Funcion para buscar rutinas
function buscarRutinas() {
    const searchInput = document.getElementById('searchRutinas');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        showNotification(`Buscando rutinas con: "${searchTerm}"`, 'info');
        // Implementar la busqueda real
    } else {
        showNotification('Por favor ingrese un término de búsqueda', 'error');
    }
}

// Funcion para agregar nueva rutina
function agregarRutina() {
    showNotification('Redirigiendo al formulario de nueva rutina...', 'info');
    
    // Redirigir al formulario de creacion
    // window.location.href = 'rutina-nueva.html';
    
    // Por ahora se muestra un modal de ejemplo
    setTimeout(() => {
        showNotification('Funcionalidad de agregar rutina en desarrollo', 'info');
    }, 1000);
}

// Funcion para ver detalles de la rutina
function verRutina(id) {
    showNotification(`Viendo detalles de la rutina ID: ${id}`, 'info');
    
    // Redirigir a la pagina de detalles
    // window.location.href = `rutina-detalle.html?id=${id}`;
}

// Funcion para editar rutina
function editarRutina(id) {
    showNotification(`Editando rutina ID: ${id}`, 'info');
    
    // Redirigir al formulario de edicion
    // window.location.href = `rutina-editar.html?id=${id}`;
}

// Funcion para eliminar rutina
function eliminarRutina(id) {
    confirmAction(
        '¿Está seguro?',
        '¿Desea eliminar esta rutina? Esta acción no se puede deshacer.',
        'Sí, eliminar',
        'Cancelar'
    ).then((result) => {
        if (result.isConfirmed) {
            showNotification(`Eliminando rutina ID: ${id}`, 'info');
            
            // Implementar la eliminacion real
            setTimeout(() => {
                showNotification('Rutina eliminada correctamente', 'success');
                loadRutinas(); // Recargar la tabla
            }, 1000);
        }
    });
}

// Funcion para ver ejercicios de la rutina
function verEjercicios(id) {
    showNotification(`Viendo ejercicios de la rutina ID: ${id}`, 'info');
    
    // Redirigir a la pagina de ejercicios de la rutina
    // window.location.href = `rutina-ejercicios.html?rutinaId=${id}`;
}

// Funcion para duplicar rutina
function duplicarRutina(id) {
    showNotification(`Duplicando rutina ID: ${id}`, 'info');
    
    // Implementar la duplicacion
    setTimeout(() => {
        showNotification('Rutina duplicada correctamente', 'success');
    }, 1000);
}

// Funcion para activar/desactivar rutina
function toggleRutina(id, estadoActual) {
    const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo';
    showNotification(`Cambiando estado de la rutina ID: ${id} a ${nuevoEstado}`, 'info');
    
    // Implementar el cambio de estado
    setTimeout(() => {
        showNotification(`Estado de la rutina cambiado a ${nuevoEstado}`, 'success');
        loadRutinas(); // Recargar la tabla
    }, 1000);
}

// Funcion para exportar rutina
function exportarRutina(id) {
    showNotification(`Exportando rutina ID: ${id}`, 'info');
    
    // Implementar la exportacion (PDF, etc.)
    setTimeout(() => {
        showNotification('Rutina exportada correctamente', 'success');
    }, 1500);
}

// Funcion para asignar rutina a cliente
function asignarRutinaACliente(rutinaId) {
    showNotification(`Asignando rutina ID: ${rutinaId} a cliente`, 'info');
    
    // Mostrar un modal para seleccionar cliente
    setTimeout(() => {
        showNotification('Funcionalidad de asignación en desarrollo', 'info');
    }, 1000);
}

// Funcion para ver estadisticas de la rutina
function verEstadisticasRutina(id) {
    showNotification(`Viendo estadísticas de la rutina ID: ${id}`, 'info');
    
    // Mostrar metricas de uso, efectividad, etc.
    setTimeout(() => {
        showNotification('Estadísticas cargadas', 'success');
    }, 1000);
}
