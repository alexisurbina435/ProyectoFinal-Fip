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
        return alert("Por favor, complete todas las casillas");
    }
    if (!validacionNombre.test(nombreCompleto)) {
        e.preventDefault();
        return alert("Nombre y apellido no válidos, no se permiten números ni caracteres especiales");
    }
    if (!validacionEmail.test(email)) {
        e.preventDefault();
        return alert("Correo électronico no válido ");
    }

    const usuarioExistente = usuarios.find((user) => user.email === email);
    
    if (usuarioExistente) {
        return alert("El email ya esta registrado");
    }
    if (password !== password2) {
        return alert("Las contraseñas no coinciden");
    }
    if (password.length < 8) {
        return alert("La contraseña debe tener al menos 8 caracteres");
    }
    
    usuarios.push({name: nombreCompleto, email: email, phone: telefono, password: password, password2: password2});
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Registro exitoso");
    window.location.href = "login.html";
});