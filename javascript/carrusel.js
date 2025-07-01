// Carrusel de productos

document.addEventListener('DOMContentLoaded', async () => {
  const carrusel = document.getElementById('carrusel-productos');
  const leftArrow = document.querySelector('.carrusel-arrow.left');
  const rightArrow = document.querySelector('.carrusel-arrow.right');
  let productos = [];
  let startIndex = 0;
  let VISIBLE_COUNT = 4; // Va a a cambiar según el tamaño de pantalla
  // Variable para controlar la transicion
  let isTransitioning = false;

  // Función para determinar el número de productos visibles según el tamaño de pantalla
  function getVisibleCount() {
    const width = window.innerWidth;
    if (width <= 480) return 2; // Cel pequeños
    if (width <= 600) return 2; // Cel grandes
    if (width <= 768) return 3; // Tablets pequeñas
    if (width <= 900) return 3; // Tablets grandes
    return 4; // Desktop
  }

  // Actualizar el número de productos visibles cuando cambie el tamaño de pantalla
  function updateVisibleCount() {
    const newVisibleCount = getVisibleCount();
    if (newVisibleCount !== VISIBLE_COUNT) {
      VISIBLE_COUNT = newVisibleCount;
      renderCarrusel();
    }
  }

  // Escuchar cambios en el tamaño de pantalla
  window.addEventListener('resize', updateVisibleCount);

  // Cargar productos desde JSON
  async function cargarProductos() {
    try {
      const response = await fetch('../data/listaProductos.json');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      productos = data;
      VISIBLE_COUNT = getVisibleCount(); // Establecer el valor inicial
      renderCarrusel();
    } catch (error) {
      console.error('Error al cargar productos:', error);
      // Mostrar mensaje de error al usuario
      carrusel.innerHTML = `
        <div style="text-align: center; color: #ee5f0d; padding: 2rem;">
          <p>Error al cargar los productos</p>
          <p>Por favor, recarga la página</p>
        </div>
      `;
    }
  }

  // Cargar productos
  await cargarProductos();

  function renderCarrusel(withTransition = false) {
    if (withTransition && isTransitioning) return;
    
    if (withTransition) {
      isTransitioning = true;
      // Fade out
      carrusel.style.transform = 'translateX(20px)';
      
      setTimeout(() => {
        updateCarruselContent();
        // Fade in
        carrusel.style.opacity = '1';
        carrusel.style.transform = 'translateX(0)';
        
        setTimeout(() => {
          isTransitioning = false;
        }, 300);
      }, 200);
    } else {
      updateCarruselContent();
    }
  }

  function updateCarruselContent() {
    carrusel.innerHTML = '';
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      // Loop
      const idx = (startIndex + i) % productos.length;
      const prod = productos[idx];
      const prodDiv = document.createElement('div');
      prodDiv.className = 'carrusel-producto';
      prodDiv.innerHTML = `
        <img src="${prod.img}" alt="${prod.nombre}" class="carrusel-producto-img">
        <h4 class="carrusel-producto-nombre">${prod.nombre}</h4>
        <p class="carrusel-producto-precio">$${prod.precio}</p>
        <div class="carrusel-botones">
          <button class="comprarAhora">Comprar Ahora</button>
          <button class="agregarCarrito">Agregar al Carrito</button>
        </div>
      `;
      // Evento para mostrar popup de detalle
      prodDiv.querySelector('.carrusel-producto-img').addEventListener('click', function() {
        mostrarPopupProducto(prod);
      });
      // Botón Agregar al Carrito
      prodDiv.querySelector('.agregarCarrito').addEventListener('click', function() {
        if (!checkLogin()) return;
        if (prod.stock <= 0) {
          alert('No hay stock disponible');
        } else {
          botonAgregarCarrito(prod);
          alert('Producto agregado al carrito');
          contadorIconoCarrito();
        }
      });
      // Botón Comprar Ahora
      prodDiv.querySelector('.comprarAhora').addEventListener('click', function() {
        if (!checkLogin()) return;
        if (prod.stock <= 0) {
          alert('No hay stock disponible');
        } else {
          localStorage.setItem('compraDirecta', JSON.stringify(prod));
          botonAgregarCarrito(prod);
          window.location.href = 'compraDirecta.html';
          contadorIconoCarrito();
        }
      });
      carrusel.appendChild(prodDiv);
    }
  }

  // Copia de funciones de carrito.js para compatibilidad si no están globales
  function botonAgregarCarrito(producto) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const index = carrito.findIndex(item => item.id === producto.id);
    if (index !== -1) {
      carrito[index].cantidad += 1;
    } else {
      producto.cantidad = 1;
      carrito.push(producto);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function contadorIconoCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contador = document.querySelector('.cart-count');
    if (contador) {
      if (carrito.length !== 0) {
        const cantidad = carrito.reduce((total, producto) => total + producto.cantidad, 0);
        contador.style.visibility = 'visible';
        contador.textContent = cantidad;
      } else {
        contador.style.visibility = 'hidden';
      }
    }
  }

  // Navegación del carrusel
  leftArrow.addEventListener('click', () => {
    if (isTransitioning) return;
    // Loop hacia atrás
    startIndex = (startIndex - 1 + productos.length) % productos.length;
    renderCarrusel(true);
  });

  rightArrow.addEventListener('click', () => {
    if (isTransitioning) return;
    // Loop hacia adelante
    startIndex = (startIndex + 1) % productos.length;
    renderCarrusel(true);
  });
});

