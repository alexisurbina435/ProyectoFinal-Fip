function insertHeader() {
  const header = `
      <header class="header">
          <nav class="navigation">
              <a href="index.html"><img src="../images/logo-sinfondo.png" class="logo" alt="logo"></a>
              <ul class="nav-list">
                  <li class="nav-item"><a href="index.html" class="nav-links" aria-label="Inicio">Inicio</a></li>
                  <li class="nav-item"><a href="productos.html" class="nav-links" aria-label="Productos">Productos</a></li>
                  <li class="nav-item"><a href="contacto.html" class="nav-links" aria-label="Contacto">Contacto</a></li>
                  <li class="nav-item"><a href="inscribite.html" class="nav-links nav-inscribite" aria-label="Inscribite">¡Inscribite ya!</a></li>
              </ul>

              <!--inicio dropdown desktop  -->
              <div class="icons-container">
                  <button class="cart-button" aria-label="Shopping Cart"><a href="../html/carrito.html">
                          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                              class="cart-icon">
                              <path
                                  d="M10.62 10H4.62M11.1 10L15.42 25.68C15.7806 26.9165 16.5295 28.0041 17.556 28.7821C18.5825 29.5601 19.8321 29.9871 21.12 30H38.6V10H11.1ZM24.62 37C24.62 38.6569 23.2768 40 21.62 40C19.9631 40 18.62 38.6569 18.62 37C18.62 35.3431 19.9631 34 21.62 34C23.2768 34 24.62 35.3431 24.62 37ZM38.62 37C38.62 38.6569 37.2768 40 35.62 40C33.9631 40 32.62 38.6569 32.62 37C32.62 35.3431 33.9631 34 35.62 34C37.2768 34 38.62 35.3431 38.62 37Z"
                                  stroke="#EE5F0D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg><span class="cart-count"></span></a>
                  </button>
                  <div class="user-container desktop">
                      <div class="dropdown">
                          <div class="select">
                              <i class="fa-regular fa-user selected icon"></i>
                              <div class="caret"></div>
                          </div>
                          <ul class="menu">
                              ${getDropdownContent()}
                          </ul>
                      </div>
                  </div>
                  <!-- fin dropdown desktop   -->

                  <!-- dropdown mobile  -->
                  <div class="user-container mobile">
                      <div class="dropdown">
                          <div class="select">
                              <i class="fa-regular fa-user selected icon"></i>
                              <div class="caret"></div>
                          </div>
                          <ul class="menu">
                              ${getMobileDropdownContent()}
                          </ul>
                      </div>
                  </div>
                  <!-- fin dropdown mobile  -->
              </div>
          </nav>
      </header>
  `;

  // Insertar el header al inicio del main
  const main = document.querySelector('.main');
  if (main) {
      main.insertAdjacentHTML('afterbegin', header);
  }
}

function getDropdownContent() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLog")) || false;
  const isAdmin = localStorage.getItem('adminAuth') === 'true';
  
  if (isAdmin) {
      // Usuario admin - dropdown para administradores
      return `
          <li><a href="admin-index.html" class="login-links">Panel Admin</a></li>
          <li><a href="admin-clientes.html" class="login-links">Administrar Clientes</a></li>
          <li><a href="admin-rutinas.html" class="login-links">Administrar Rutinas</a></li>
          <li><a href="admin-ejercicios.html" class="login-links">Administrar Ejercicios</a></li>
          <li><a href="admin-tienda.html" class="login-links">Administrar Tienda</a></li>
          <li><a href="admin-perfil.html" class="login-links">Perfil Admin</a></li>
          <li><a href="#" class="login-links" id="logout">Cerrar sesión</a></li>
      `;
  } else if (usuario) {
      // Usuario logueado - dropdown para usuarios autenticados
      return `
          <li><a href="#" class="login-links">Rutina</a></li>
          <li><a href="#" class="login-links">Progreso</a></li>
          <li><a href="#" class="login-links">Consulta</a></li>
          <li><a href="#" class="login-links">Blog</a></li>
          <li><a href="#" class="login-links" id="logout">Cerrar sesión</a></li>
      `;
  } else {
      // Usuario no logueado - dropdown para usuarios no autenticados
      return `
          <li><a href="register.html" class="login-links">Crear cuenta</a></li>
          <li><a href="login.html" class="login-links">Acceder</a></li>
      `;
  }
}

function getMobileDropdownContent() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLog")) || false;
  const isAdmin = localStorage.getItem('adminAuth') === 'true';
  
  if (isAdmin) {
      // Usuario admin - dropdown mobile para administradores
      return `
          <li class="nav-item"><a href="inscribite.html" class="login-links" aria-label="Inscribite">¡Inscribite ya!</a></li>
          <li class="nav-item"><a href="index.html" class="login-links" aria-label="Inicio">Inicio</a></li>
          <li class="nav-item"><a href="productos.html" class="login-links" aria-label="Productos">Productos</a></li>
          <li class="nav-item"><a href="contacto.html" class="login-links" aria-label="Contacto">Contacto</a></li>
          <li><a href="admin-index.html" class="login-links">Panel Admin</a></li>
          <li><a href="admin-clientes.html" class="login-links">Administrar Clientes</a></li>
          <li><a href="admin-rutinas.html" class="login-links">Administrar Rutinas</a></li>
          <li><a href="admin-ejercicios.html" class="login-links">Administrar Ejercicios</a></li>
          <li><a href="admin-tienda.html" class="login-links">Administrar Tienda</a></li>
          <li><a href="admin-perfil.html" class="login-links">Perfil Admin</a></li>
          <li><a href="#" class="login-links" id="logout">Cerrar sesión</a></li>
      `;
  } else if (usuario) {
      // Usuario logueado - dropdown mobile para usuarios autenticados
      return `
          <li class="nav-item"><a href="inscribite.html" class="login-links" aria-label="Inscribite">¡Inscribite ya!</a></li>
          <li class="nav-item"><a href="index.html" class="login-links" aria-label="Inicio">Inicio</a></li>
          <li class="nav-item"><a href="productos.html" class="login-links" aria-label="Productos">Productos</a></li>
          <li class="nav-item"><a href="contacto.html" class="login-links" aria-label="Contacto">Contacto</a></li>
          <li><a href="#" class="login-links">Rutina</a></li>
          <li><a href="#" class="login-links">Progreso</a></li>
          <li><a href="#" class="login-links">Consulta</a></li>
          <li><a href="#" class="login-links">Blog</a></li>
          <li><a href="#" class="login-links" id="logout">Cerrar sesión</a></li>
      `;
  } else {
      // Usuario no logueado - dropdown mobile para usuarios no autenticados
      return `
          <li class="nav-item"><a href="inscribite.html" class="login-links" aria-label="Inscribite">¡Inscribite ya!</a></li>
          <li class="nav-item"><a href="index.html" class="login-links" aria-label="Inicio">Inicio</a></li>
          <li class="nav-item"><a href="productos.html" class="login-links" aria-label="Productos">Productos</a></li>
          <li class="nav-item"><a href="contacto.html" class="login-links" aria-label="Contacto">Contacto</a></li>
          <li><a href="register.html" class="login-links">Crear cuenta</a></li>
          <li><a href="login.html" class="login-links">Acceder</a></li>
      `;
  }
}

// Actualizar el header cuando cambie el estado de login
function updateHeader() {
  // Remover el header existente
  const existingHeader = document.querySelector('.header');
  if (existingHeader) {
      existingHeader.remove();
  }
  
  // Insertar el nuevo header
  insertHeader();
  
  // Reinicializar el dropdown
  if (typeof initializeDropdown === 'function') {
      initializeDropdown();
  }
  
  // Agregar event listener para logout si el usuario está logueado
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
  }
}

function handleLogout() {
  Swal.fire({
      icon: 'info',
      title: '¡Hasta pronto!',
      text: 'Has cerrado sesión correctamente',
      confirmButtonColor: '#ee5f0d'
  }).then(() => {
      localStorage.removeItem("usuarioLog");
      localStorage.removeItem("carrito");
      updateHeader();
  });
}

// Inicializar el header cuando se carga la pagina
document.addEventListener('DOMContentLoaded', () => {
  insertHeader();
  
  // Agregar event listener para logout si el usuario está logueado
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
  }
});