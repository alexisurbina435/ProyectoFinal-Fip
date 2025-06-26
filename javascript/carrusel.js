// Carrusel de productos

document.addEventListener('DOMContentLoaded', () => {
  const carrusel = document.getElementById('carrusel-productos');
  const leftArrow = document.querySelector('.carrusel-arrow.left');
  const rightArrow = document.querySelector('.carrusel-arrow.right');
  let productos = [];
  let startIndex = 0;
  const VISIBLE_COUNT = 4;

  // Cargar productos desde JSON
  fetch('../data/listaProductos.json')
    .then(res => res.json())
    .then(data => {
      productos = data;
      renderCarrusel();
    });

  function renderCarrusel() {
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
    // Loop hacia atrás
    startIndex = (startIndex - 1 + productos.length) % productos.length;
    renderCarrusel();
  });

  rightArrow.addEventListener('click', () => {
    // Loop hacia adelante
    startIndex = (startIndex + 1) % productos.length;
    renderCarrusel();
  });

  // Popup de detalle de producto
  function mostrarPopupProducto(producto) {
    // Si ya existe, eliminarlo
    let popupExistente = document.getElementById('popup-producto');
    if (popupExistente) popupExistente.remove();
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'popup-producto';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';
    overlay.innerHTML = `
      <div class="producto-detail" style="background:#fff; border-radius:16px; max-width:700px; width:90vw; padding:2rem; position:relative; box-shadow:0 8px 32px rgba(0,0,0,0.25);">
        <button id="cerrar-popup-producto" style="position:absolute; top:1rem; right:1rem; background:none; border:none; font-size:2rem; color:#EE5F0D; cursor:pointer;">&times;</button>
        <div style="display:flex; flex-wrap:wrap; gap:2rem; align-items:center;">
          <div class="product-images" style="flex:1; min-width:200px;">
            <img src="${producto.img}" alt="${producto.nombre}" class="product-main-image" style="width:100%; max-width:250px; border-radius:12px; object-fit:contain;">
          </div>
          <div class="product-info" style="flex:2; min-width:220px;">
            <h1 class="product-title" style="font-size:1.5rem; margin-bottom:0.5rem;">${producto.nombre}</h1>
            <div class="product-rating" style="margin-bottom:0.5rem;">
              <span class="rating-number">4.7</span>
              <span style="color:gold;">&#9733;&#9733;&#9733;&#9733;</span>
            </div>
            <div class="product-price" style="margin-bottom:0.5rem; font-size:1.2rem; color:#105A37; font-weight:bold;">
              <span>$${producto.precio}</span>
            </div>
            <div class="stock-status" style="margin-bottom:0.5rem; color:#105A37;">Stock disponible: ${producto.stock}</div>
            <button class="comprarAhora" style="margin-right:0.5rem;">Comprar Ahora</button>
            <button class="agregarCarrito">Agregar al Carrito</button>
            <div class="product-description" style="margin-top:1rem;">
              <h2 style="font-size:1.1rem; margin-bottom:0.3rem;">Descripción</h2>
              <div class="description-box" style="background:#f7f7f7; border-radius:8px; padding:0.7rem;">${producto.descripcion}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    // Cerrar popup
    document.getElementById('cerrar-popup-producto').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    // Botones funcionales dentro del popup
    overlay.querySelector('.comprarAhora').onclick = function() {
      if (producto.stock <= 0) {
        alert('No hay stock disponible');
      } else {
        localStorage.setItem('compraDirecta', JSON.stringify(producto));
        botonAgregarCarrito(producto);
        window.location.href = 'compraDirecta.html';
        contadorIconoCarrito();
      }
    };
    overlay.querySelector('.agregarCarrito').onclick = function() {
      if (producto.stock <= 0) {
        alert('No hay stock disponible');
      } else {
        botonAgregarCarrito(producto);
        alert('Producto agregado al carrito');
        contadorIconoCarrito();
      }
    };
  }
});

