// Funcionalidad para paginas de administracion

document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del perfil en pagina perfil
    if (window.location.pathname.includes('admin-perfil.html')) {
        loadProfileData();
        setupProfileForm();
    }
    
    // Configurar navegacion de opciones de administracion
    if (window.location.pathname.includes('admin-index.html')) {
        setupAdminOptions();
    }
});

// Funcion para cargar datos del perfil
function loadProfileData() {
    // Cargar los datos del perfil desde localStorage o una API
    // Datos de ejemplo
    const profileData = {
        nombre: 'Administrador',
        correo: 'admin@superarse.com',
        telefono: '+54 9 1234-5678',
    };
    
    // Llenar el formulario con los datos
    document.getElementById('nombre').value = profileData.nombre;
    document.getElementById('correo').value = profileData.correo;
    document.getElementById('telefono').value = profileData.telefono;
}

// Funcion para configurar el formulario de perfil
function setupProfileForm() {
    const form = document.getElementById('profileForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            correo: document.getElementById('correo').value.trim(),
            telefono: document.getElementById('telefono').value.trim()
        };
        
        // Validar los datos
        if (validateProfileData(formData)) {
            // Guardar los cambios (aca va logica para guardar los datos en la base de datos)
            saveProfileData(formData);
            
            // Mostrar mensaje de exito
            showNotification('Perfil actualizado correctamente', 'success');
        }
    });
}

// Funcion para validar datos del perfil
function validateProfileData(data) {
    if (!data.nombre || data.nombre.length < 2) {
        showNotification('El nombre debe tener al menos 2 caracteres', 'error');
        return false;
    }
    
    if (!data.correo || !isValidEmail(data.correo)) {
        showNotification('Ingrese un correo electrónico válido', 'error');
        return false;
    }
    
    if (!data.telefono || data.telefono.length < 8) {
        showNotification('El teléfono debe tener al menos 8 dígitos', 'error');
        return false;
    }
    
    return true;
}

// Funcion para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Funcion para guardar datos del perfil
function saveProfileData(data) {
    // Guardar los datos en localStorage o enviarlos a una API
    localStorage.setItem('adminProfile', JSON.stringify(data));
    console.log('Perfil guardado:', data);
}

// Funcion para configurar las opciones de administracion
function setupAdminOptions() {
    const adminOptions = document.querySelectorAll('.admin-option');
    
    adminOptions.forEach(option => {
        option.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            handleAdminOption(title);
        });
        
        // Agregar efecto de hover con teclado
        option.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const title = this.querySelector('h3').textContent;
                handleAdminOption(title);
            }
        });
        
        // Hacer las opciones accesibles por teclado
        option.setAttribute('tabindex', '0');
        option.setAttribute('role', 'button');
        option.setAttribute('aria-label', `Ir a ${option.querySelector('h3').textContent}`);
    });
}

// Funcion para manejar la seleccion de opciones de administracion
function handleAdminOption(optionTitle) {
    // Configurar navegacion a las diferentes secciones
        // Redireccion
        switch(optionTitle) {
            case 'Administrar Clientes':
                window.location.href = 'admin-clientes.html';
                break;
            case 'Administrar Rutinas':
                window.location.href = 'admin-rutinas.html';
                break;
            case 'Administrar Ejercicios':
                window.location.href = 'admin-ejercicios.html';
                break;
            case 'Administrar Tienda':
                window.location.href = 'admin-tienda.html';
                break;
        }
}

// Funcion para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificacion
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.textContent = message;
    
    // Estilos basicos para la notificacion
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Colores segun el tipo
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'info':
            notification.style.backgroundColor = '#17a2b8';
            break;
        default:
            notification.style.backgroundColor = '#6c757d';
    }
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Mostrar la notificacion
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar despues de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Funcion para verificar si el usuario esta autenticado como administrador
function checkAdminAuth() {
    // Verificar la autenticacion del administrador
    const isAdmin = localStorage.getItem('adminAuth') === 'true';
    
    if (!isAdmin) {
        // Redirigir al login si no esta autenticado
        window.location.href = 'login.html';
        console.log('Usuario no autorizado, redirigiendo al login');
    }
}

// Verificacion de autenticacion
checkAdminAuth();

// Funcion para confirmaciones usando SweetAlert2
function confirmAction(title, text, confirmText = 'Confirmar', cancelText = 'Cancelar') {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ee5f0d',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmText,
        cancelButtonText: cancelText
    });
}

// Funcion para mostrar mensajes de exito
function showSuccessAlert(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'success',
        confirmButtonColor: '#ee5f0d'
    });
}

// Funcion para mostrar mensajes de error
function showErrorAlert(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'error',
        confirmButtonColor: '#ee5f0d'
    });
}

// Funcion para mostrar mensajes de informacion
function showInfoAlert(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'info',
        confirmButtonColor: '#ee5f0d'
    });
}
