let loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  let validarUsuario = usuarios.find(user => user.email === email && user.password === password);
  if (!validarUsuario) {
    return alert("Email y/o contraseña incorrectos");
  }
  alert(`Bienvenido ${validarUsuario.name}`);
  localStorage.setItem("usuarioLog", JSON.stringify(validarUsuario));
  window.location.href = "indexLog.html";
})

