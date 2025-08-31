let loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  let validarUsuario = usuarios.find(user => user.email === email && user.password === password);
  if (!validarUsuario) {
    // e.preventDefault();
    Swal.fire({
      icon: 'error',
      title: 'Credenciales incorrectas',
      text: 'Email y/o contraseña incorrectos',
      confirmButtonColor: '#ee5f0d'
    });
    return;
  }
  Swal.fire({
    icon: 'success',
    title: `¡Bienvenido ${validarUsuario.name}!`,
    text: 'Has iniciado sesión correctamente',
    confirmButtonColor: '#ee5f0d'
  });
  localStorage.setItem("usuarioLog", JSON.stringify(validarUsuario));
  window.location.href = "index.html";
})

