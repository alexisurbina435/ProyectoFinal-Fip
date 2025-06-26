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
        <img src=${prod.img} alt="${prod.nombre}" class="carrusel-producto-img">
        <h4 class="carrusel-producto-nombre">${prod.nombre}</h4>
        <p class="carrusel-producto-precio">$${prod.precio}</p>
      `;
      carrusel.appendChild(prodDiv);
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
});

