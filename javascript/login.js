let loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  console.log('Intentando login con:', { email, password });
  console.log('Usuarios disponibles:', usuarios);

  let validarUsuario = usuarios.find(user => user.email === email && user.password === password);
  if (!validarUsuario) {
    console.log('Usuario no encontrado o credenciales incorrectas');
    Swal.fire({
      icon: 'error',
      title: 'Credenciales incorrectas',
      text: 'Email y/o contraseña incorrectos',
      confirmButtonColor: '#ee5f0d'
    });
    return;
  }

  console.log('Usuario encontrado:', validarUsuario);

  // Verificar si el usuario es admin
  let isAdmin = false;
  
  // Lista de emails de administradores (puedes modificar esta lista)
  const adminEmails = [
    'admin@superarse.com',
    'admin@test.com',
    'superarse@gmail.com'
  ];
  
  console.log('Emails de admin:', adminEmails);
  console.log('Email del usuario:', email.toLowerCase());
  
  // Verificar si el email está en la lista de admins
  if (adminEmails.includes(email.toLowerCase())) {
    isAdmin = true;
    localStorage.setItem("adminAuth", "true");
    console.log('Usuario marcado como ADMIN');
  } else {
    // Asegurarse de que no sea admin
    localStorage.removeItem("adminAuth");
    console.log('Usuario marcado como NO ADMIN');
  }

  console.log('Estado final - isAdmin:', isAdmin);
  console.log('adminAuth en localStorage:', localStorage.getItem('adminAuth'));

  Swal.fire({
    icon: 'success',
    title: `¡Bienvenido ${validarUsuario.name}!`,
    text: isAdmin ? 'Has iniciado sesión como administrador' : 'Has iniciado sesión correctamente',
    confirmButtonColor: '#ee5f0d'
  });
  
  localStorage.setItem("usuarioLog", JSON.stringify(validarUsuario));
  
  // Redirigir según el tipo de usuario
  if (isAdmin) {
    console.log('Redirigiendo a admin-index.html');
    window.location.href = "admin-index.html";
  } else {
    console.log('Redirigiendo a index.html');
    window.location.href = "index.html";
  }
})

