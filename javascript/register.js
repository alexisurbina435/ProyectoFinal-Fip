let registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit",  (e) =>{
    e.preventDefault();
    let nombreCompleto = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let telefono = document.getElementById("phone").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("repeat-password").value;
    
    let validacionNombre = /^[a-zA-ZéÉáÁíóúÍÓÚÑñ\s]*$/;
    let validacionEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{3,4}$/i;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // const usuarioExistente = usuarios.find((user) => user.email === email);
    if(!email || !password || !password2 || !telefono || !nombreCompleto){
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, complete todas las casillas',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    if (!validacionNombre.test(nombreCompleto)) {
        e.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Nombre inválido',
            text: 'Nombre y apellido no válidos, no se permiten números ni caracteres especiales',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    if (!validacionEmail.test(email)) {
        e.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Email inválido',
            text: 'Correo electrónico no válido',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }

    const usuarioExistente = usuarios.find((user) => user.email === email);
    
    if (usuarioExistente) {
        Swal.fire({
            icon: 'error',
            title: 'Email ya registrado',
            text: 'El email ya está registrado',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    if (password !== password2) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseñas no coinciden',
            text: 'Las contraseñas no coinciden',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    if (password.length < 8) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña muy corta',
            text: 'La contraseña debe tener al menos 8 caracteres',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }
    
    usuarios.push({name: nombreCompleto, email: email, phone: telefono, password: password, password2: password2});
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada correctamente',
        confirmButtonColor: '#ee5f0d'
    });
    window.location.href = "login.html";
});