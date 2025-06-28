// Carrusel de productos

document.addEventListener('DOMContentLoaded', () => {
  const carrusel = document.getElementById('carrusel-productos');
  const leftArrow = document.querySelector('.carrusel-arrow.left');
  const rightArrow = document.querySelector('.carrusel-arrow.right');
  let productos = [];
  let startIndex = 0;
  const VISIBLE_COUNT = 4;
  let isTransitioning = false;

  // Cargar productos desde JSON
  fetch('../data/listaProductos.json')
    .then(res => res.json())
    .then(data => {
      productos = data;
      renderCarrusel();
    });

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

