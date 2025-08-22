// Funcionalidad para administracion de ejercicios

document.addEventListener('DOMContentLoaded', function() {
    loadEjercicios();
    setupSearch();
});

// Funcion para cargar ejercicios desde la base de datos
function loadEjercicios() {
    // Cargar los datos desde la API/BD
    // Datos de ejemplo
    const ejercicios = [
        {
            id: 1,
            nombre: 'Flexiones de pecho',
            descripcion: 'Ejercicio básico para fortalecer pectorales, tríceps y hombros',
            grupoMuscular: 'Pecho',
            nivel: 'Principiante',
            imagen: 'flexiones.jpg',
            video: 'flexiones.mp4',
            estado: 'Activo'
        },
        {
            id: 2,
            nombre: 'Sentadillas',
            descripcion: 'Ejercicio fundamental para piernas y glúteos',
            grupoMuscular: 'Piernas',
            nivel: 'Principiante',
            imagen: 'sentadillas.jpg',
            video: 'sentadillas.mp4',
            estado: 'Activo'
        },
        {
            id: 3,
            nombre: 'Plancha',
            descripcion: 'Ejercicio isométrico para core y estabilidad',
            grupoMuscular: 'Core',
            nivel: 'Intermedio',
            imagen: 'plancha.jpg',
            video: 'plancha.mp4',
            estado: 'Activo'
        },
        {
            id: 4,
            nombre: 'Burpees',
            descripcion: 'Ejercicio completo de alta intensidad',
            grupoMuscular: 'Full Body',
            nivel: 'Avanzado',
            imagen: 'burpees.jpg',
            video: 'burpees.mp4',
            estado: 'Activo'
        },
        {
            id: 5,
            nombre: 'Pull-ups',
            descripcion: 'Dominadas para espalda y bíceps',
            grupoMuscular: 'Espalda',
            nivel: 'Avanzado',
            imagen: 'pullups.jpg',
            video: 'pullups.mp4',
            estado: 'Inactivo'
        }
    ];

    renderEjerciciosTable(ejercicios);
}

// Funcion para renderizar la tabla de ejercicios
function renderEjerciciosTable(ejercicios) {
    const tbody = document.getElementById('ejerciciosTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    ejercicios.forEach(ejercicio => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${ejercicio.id}</td>
            <td>${ejercicio.nombre}</td>
            <td>${ejercicio.descripcion}</td>
            <td><span class="status-${ejercicio.grupoMuscular.toLowerCase().replace(' ', '-')}">${ejercicio.grupoMuscular}</span></td>
            <td><span class="status-${ejercicio.nivel.toLowerCase()}">${ejercicio.nivel}</span></td>
            <td><a href="#" class="table-link" onclick="verImagen(${ejercicio.id})">Ver imagen</a></td>
            <td><a href="#" class="table-link" onclick="verVideo(${ejercicio.id})">Ver video</a></td>
            <td><span class="status-${ejercicio.estado.toLowerCase()}">${ejercicio.estado}</span></td>
            <td>
                <div class="action-buttons-table">
                    <button class="btn-view" onclick="verEjercicio(${ejercicio.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-edit" onclick="editarEjercicio(${ejercicio.id})" title="Editar">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="eliminarEjercicio(${ejercicio.id})" title="Eliminar">
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
    const searchInput = document.getElementById('searchEjercicios');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterEjercicios(searchTerm);
        });
    }
}

// Funcion para filtrar ejercicios
function filterEjercicios(searchTerm) {
    // Implementar la logica de filtrado real
    // Por ahora cargamos todos los ejercicios
    loadEjercicios();
}

// Funcion para buscar ejercicios
function buscarEjercicios() {
    const searchInput = document.getElementById('searchEjercicios');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        showNotification(`Buscando ejercicios con: "${searchTerm}"`, 'info');
        // Implementar la busqueda real
    } else {
        showNotification('Por favor ingrese un término de búsqueda', 'error');
    }
}

// Funcion para agregar nuevo ejercicio
function agregarEjercicio() {
    showNotification('Redirigiendo al formulario de nuevo ejercicio...', 'info');
    
    // Redirigir al formulario de creacion
    // window.location.href = 'ejercicio-nuevo.html';
    
    // Por ahora se muestra un modal de ejemplo
    setTimeout(() => {
        showNotification('Funcionalidad de agregar ejercicio en desarrollo', 'info');
    }, 1000);
}

// Funcion para ver detalles del ejercicio
function verEjercicio(id) {
    showNotification(`Viendo detalles del ejercicio ID: ${id}`, 'info');
    
    // Redirigir a la pagina de detalles
    // window.location.href = `ejercicio-detalle.html?id=${id}`;
}

// Funcion para editar ejercicio
function editarEjercicio(id) {
    showNotification(`Editando ejercicio ID: ${id}`, 'info');
    
    // Redirigir al formulario de edicion
    // window.location.href = `ejercicio-editar.html?id=${id}`;
}

// Funcion para eliminar ejercicio
function eliminarEjercicio(id) {
    confirmAction(
        '¿Está seguro?',
        '¿Desea eliminar este ejercicio? Esta acción no se puede deshacer.',
        'Sí, eliminar',
        'Cancelar'
    ).then((result) => {
        if (result.isConfirmed) {
            showNotification(`Eliminando ejercicio ID: ${id}`, 'info');
            
            // Implementar la eliminacion real
            setTimeout(() => {
                showNotification('Ejercicio eliminado correctamente', 'success');
                loadEjercicios(); // Recargar la tabla
            }, 1000);
        }
    });
}

// Funcion para ver imagen del ejercicio
function verImagen(id) {
    showNotification(`Viendo imagen del ejercicio ID: ${id}`, 'info');
    
    // Mostrar un modal con la imagen
    // o redirigir a una pagina de visualizacion
}

// Funcion para ver video del ejercicio
function verVideo(id) {
    showNotification(`Reproduciendo video del ejercicio ID: ${id}`, 'info');
    
    // Mostrar un modal con el video
    // o redirigir a una pagina de reproduccion
}

// Funcion para duplicar ejercicio
function duplicarEjercicio(id) {
    showNotification(`Duplicando ejercicio ID: ${id}`, 'info');
    
    // Implementar la duplicacion
    setTimeout(() => {
        showNotification('Ejercicio duplicado correctamente', 'success');
    }, 1000);
}

// Funcion para activar/desactivar ejercicio
function toggleEjercicio(id, estadoActual) {
    const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo';
    showNotification(`Cambiando estado del ejercicio ID: ${id} a ${nuevoEstado}`, 'info');
    
    // Implementar el cambio de estado
    setTimeout(() => {
        showNotification(`Estado del ejercicio cambiado a ${nuevoEstado}`, 'success');
        loadEjercicios(); // Recargar la tabla
    }, 1000);
}

// Funcion para subir nueva imagen
function subirImagen(id) {
    showNotification(`Subiendo nueva imagen para ejercicio ID: ${id}`, 'info');
    
    // Mostrar un input de archivo
    setTimeout(() => {
        showNotification('Funcionalidad de subida de imagen en desarrollo', 'info');
    }, 1000);
}

// Funcion para subir nuevo video
function subirVideo(id) {
    showNotification(`Subiendo nuevo video para ejercicio ID: ${id}`, 'info');
    
    // Aquí se mostraría un input de archivo
    setTimeout(() => {
        showNotification('Funcionalidad de subida de video en desarrollo', 'info');
    }, 1000);
}

// Funcion para categorizar ejercicio
function categorizarEjercicio(id) {
    showNotification(`Categorizando ejercicio ID: ${id}`, 'info');
    
    // Mostrar un modal para seleccionar categoria
    setTimeout(() => {
        showNotification('Funcionalidad de categorización en desarrollo', 'info');
    }, 1000);
}

// Funcion para ver ejercicios relacionados
function verEjerciciosRelacionados(id) {
    showNotification(`Viendo ejercicios relacionados con ID: ${id}`, 'info');
    
    // Mostrar ejercicios del mismo grupo muscular o nivel
    setTimeout(() => {
        showNotification('Ejercicios relacionados cargados', 'success');
    }, 1000);
}

// Funcion para exportar ejercicio
function exportarEjercicio(id) {
    showNotification(`Exportando ejercicio ID: ${id}`, 'info');
    
    // Implementar la exportacion (PDF, etc.)
    setTimeout(() => {
        showNotification('Ejercicio exportado correctamente', 'success');
    }, 1500);
}

// Funcion para ver estadisticas del ejercicio
function verEstadisticasEjercicio(id) {
    showNotification(`Viendo estadísticas del ejercicio ID: ${id}`, 'info');
    
    // Mostrar metricas de uso, efectividad, etc.
    setTimeout(() => {
        showNotification('Estadísticas cargadas', 'success');
    }, 1000);
}
