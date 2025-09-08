// Funcionalidad para la página de perfil
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado --VER! LA UNICA FORMA DE ENTRAR ES POR EL DROPDOWN Y AHI SE VERIFICA SI ESTA LOGUEADO O NO
    const usuario = JSON.parse(localStorage.getItem("usuarioLog")) || false;
    
    if (!usuario) {
        // Si no esta logueado, redirigir al login
        Swal.fire({
            icon: 'warning',
            title: 'Acceso Restringido',
            text: 'Debes iniciar sesión para acceder a tu perfil',
            confirmButtonColor: '#ee5f0d'
        }).then(() => {
            window.location.href = 'login.html';
        });
        return;
    }

    // Cargar datos del usuario
    loadUserData();
    
    // Inicializar navegación
    initializeProfileNavigation();
    
    // Inicializar formularios
    initializeForms();
});

// Cargar datos del usuario
function loadUserData() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLog"));
    
    if (usuario) {
        // Cargar datos en los campos de solo lectura
        document.getElementById('nombreActual').value = `${usuario.nombre || ''}`.trim();
        document.getElementById('correoActual').value = usuario.email || '';
        document.getElementById('telefonoActual').value = usuario.telefono || '';
        document.getElementById('direccionActual').value = usuario.direccion || '';
        
        // Cargar datos del plan si existen
        if (usuario.plan) {
            loadPlanData(usuario.plan);
        }
    }
}

// Cargar datos del plan
function loadPlanData(plan) {
    const planData = {
        'premium': {
            nombre: 'Plan Premium',
            precio: '$40.000',
            beneficios: [
                'Entrenamiento online libre',
                'Entrenamiento progresivo',
                'Clase consulta ilimitadas',
                'Subscripcion mensual',
                'Descuento en tienda 15%',
                'Entrenos one-one'
            ]
        },
        'standar': {
            nombre: 'Plan Standar',
            precio: '$35.000',
            beneficios: [
                'Entrenamiento online libre',
                'Entrenamiento progresivo',
                'Clase consulta limitadas',
                'Subscripcion mensual',
                'Descuento en tienda 10%',
                '3 entrenos diferentes'
            ]
        },
        'basic': {
            nombre: 'Plan Básico',
            precio: '$30.000',
            beneficios: [
                'Entrenamiento online libre',
                'Entrenamiento progresivo',
                'Clase consulta limitadas',
                'Subscripcion mensual',
                'Descuento en tienda 5%',
                'Entrenos 2 veces'
            ]
        }
    };

    const planInfo = planData[plan] || planData['premium'];
    
    document.getElementById('planNombre').textContent = planInfo.nombre;
    document.getElementById('planPrecio').textContent = planInfo.precio;
    
    const beneficiosList = document.getElementById('planBeneficios');
    beneficiosList.innerHTML = '';
    planInfo.beneficios.forEach(beneficio => {
        const li = document.createElement('li');
        li.textContent = beneficio;
        beneficiosList.appendChild(li);
    });
}

// Inicializar navegación entre secciones
function initializeProfileNavigation() {
    const navItems = document.querySelectorAll('.profile-nav-item');
    const sections = document.querySelectorAll('.profile-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remover clase active de todos los elementos
            navItems.forEach(nav => nav.classList.remove('profile-active'));
            sections.forEach(section => section.classList.remove('profile-active'));
            
            // Agregar clase active al elemento clickeado y su sección
            this.classList.add('profile-active');
            document.getElementById(targetSection).classList.add('profile-active');
        });
    });
}

// Inicializar formularios
function initializeForms() {
    // Formulario de nombre
    const nombreForm = document.getElementById('nombreForm');
    if (nombreForm) {
        nombreForm.addEventListener('submit', handleNombreSubmit);
    }
    
    // Formulario de correo
    const correoForm = document.getElementById('correoForm');
    if (correoForm) {
        correoForm.addEventListener('submit', handleCorreoSubmit);
    }
    
    // Formulario de contraseña
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordSubmit);
    }
    
    // Formulario de teléfono
    const telefonoForm = document.getElementById('telefonoForm');
    if (telefonoForm) {
        telefonoForm.addEventListener('submit', handleTelefonoSubmit);
    }
    
    // Formulario de dirección
    const direccionForm = document.getElementById('direccionForm');
    if (direccionForm) {
        direccionForm.addEventListener('submit', handleDireccionSubmit);
    }
    
    // Botones cancelar
    const cancelButtons = document.querySelectorAll('.btn-cancel');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const form = this.closest('form');
            if (form) {
                form.reset();
            }
        });
    });
}

// Manejadores de formularios
function handleNombreSubmit(e) {
    e.preventDefault();
    
    const nuevoNombre = document.getElementById('nuevoNombre').value.trim();
    const nuevoApellido = document.getElementById('nuevoApellido').value.trim();
    
    if (!nuevoNombre || !nuevoApellido) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor completa todos los campos',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    
    // Simular actualización
    Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Tu nombre ha sido actualizado correctamente',
        confirmButtonColor: '#ee5f0d'
    }).then(() => {
        // Actualizar localStorage
        const usuario = JSON.parse(localStorage.getItem("usuarioLog"));
        usuario.nombre = nuevoNombre;
        usuario.apellido = nuevoApellido;
        localStorage.setItem("usuarioLog", JSON.stringify(usuario));
        
        // Actualizar campo de solo lectura
        document.getElementById('nombreActual').value = `${nuevoNombre} ${nuevoApellido}`;
        
        // Limpiar formulario
        e.target.reset();
    });
}

function handleCorreoSubmit(e) {
    e.preventDefault();
    
    const nuevoCorreo = document.getElementById('nuevoCorreo').value.trim();
    const confirmarCorreo = document.getElementById('confirmarCorreo').value.trim();
    
    if (!nuevoCorreo || !confirmarCorreo) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor completa todos los campos',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    
    if (nuevoCorreo !== confirmarCorreo) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Los correos no coinciden',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(nuevoCorreo)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingresa un correo válido',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    
    // Simular actualización
    Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Tu correo ha sido actualizado correctamente',
        confirmButtonColor: '#ee5f0d'
    }).then(() => {
        // Actualizar localStorage
        const usuario = JSON.parse(localStorage.getItem("usuarioLog"));
        usuario.email = nuevoCorreo;
        localStorage.setItem("usuarioLog", JSON.stringify(usuario));
        
        // Actualizar campo de solo lectura
        document.getElementById('correoActual').value = nuevoCorreo;
        
        // Limpiar formulario
        e.target.reset();
    });
}

function handlePasswordSubmit(e) {
    e.preventDefault();
    
    const passwordActual = document.getElementById('passwordActual').value;
    const nuevaPassword = document.getElementById('nuevaPassword').value;
    const confirmarPassword = document.getElementById('confirmarPassword').value;
    
    if (!passwordActual || !nuevaPassword || !confirmarPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor completa todos los campos',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    
    if (nuevaPassword !== confirmarPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    
    if (nuevaPassword.length < 6) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña debe tener al menos 6 caracteres',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    
    // Simular actualización
    Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Tu contraseña ha sido actualizada correctamente',
        confirmButtonColor: '#ee5f0d'
    }).then(() => {
        // Limpiar formulario
        e.target.reset();
    });
}

function handleTelefonoSubmit(e) {
    e.preventDefault();
    
    const nuevoTelefono = document.getElementById('nuevoTelefono').value.trim();
    
    if (!nuevoTelefono) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingresa un teléfono',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    
    // Simular actualización
    Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Tu teléfono ha sido actualizado correctamente',
        confirmButtonColor: '#ee5f0d'
    }).then(() => {
        // Actualizar localStorage
        const usuario = JSON.parse(localStorage.getItem("usuarioLog"));
        usuario.telefono = nuevoTelefono;
        localStorage.setItem("usuarioLog", JSON.stringify(usuario));
        
        // Actualizar campo de solo lectura
        document.getElementById('telefonoActual').value = nuevoTelefono;
        
        // Limpiar formulario
        e.target.reset();
    });
}

function handleDireccionSubmit(e) {
    e.preventDefault();
    
    const nuevaDireccion = document.getElementById('nuevaDireccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    
    if (!nuevaDireccion || !ciudad) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor completa los campos obligatorios',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    
    // Simular actualización
    Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Tu dirección ha sido actualizada correctamente',
        confirmButtonColor: '#ee5f0d'
    }).then(() => {
        // Actualizar localStorage
        const usuario = JSON.parse(localStorage.getItem("usuarioLog"));
        usuario.direccion = nuevaDireccion;
        usuario.ciudad = ciudad;
        localStorage.setItem("usuarioLog", JSON.stringify(usuario));
        
        // Actualizar campo de solo lectura
        document.getElementById('direccionActual').value = nuevaDireccion;
        
        // Limpiar formulario
        e.target.reset();
    });
}
