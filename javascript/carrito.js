// Traer el json
fetch('../data/listaProductos.json')
    .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
        return response.json();
    })
    .then(data => {
        if (window.location.pathname.includes("productos.html"), ("productosLog.html")) {
            llenarProductos(data);
        }
    })
    .catch(error => {
        console.error("Error al cargar el JSON:", error);
    });

window.addEventListener("DOMContentLoaded", contadorIconoCarrito);
//Funcion para llenar los productos y botones funcionales
let llenarProductos = function (data) {
    const productosContainer = document.getElementById("productosContainer");
    if (!productosContainer) {
        console.error("No se encontró el contenedor de productos.");
        return;
    }
    // Cards de productos
    data.forEach(producto => {
        const card = document.createElement("article");
        card.classList.add("card-producto");
        card.innerHTML += `
                    <div class="card">
                        <div>
                            <span class="stock">Stock disponible: ${producto.stock}</span>
                            <img decoding="async" src="${producto.img}" class="img-prod"
                            alt="${producto.descripcion}" />
                        </div>
                        <div class="detalle-prod">
                            <h2 class="producto-nombre">${producto.nombre}</h2>
                            <p class="descripcion-prod">${producto.descripcion}</p>
                            <p class="precio"><span>$</span> ${producto.precio}</p>
                        </div>
                        <div class="botones">
                            <button class="comprarAhora">Comprar Ahora</button>
                            <button class="agregarCarrito">Agregar al Carrito</button>
                         </div>
                    </div>
                `;

        const botonAgregar = card.querySelector(".agregarCarrito");
        const botonComprar = card.querySelector(".comprarAhora");
        const stock = card.querySelector(".stock");
        const img = card.querySelector(".img-prod");

        // Evento para mostrar popup de detalle
        img.addEventListener('click', function () {
            mostrarPopupProducto(producto);
        });

        // Verifica stock y activa la funcion de agregar
        botonAgregar.addEventListener("click", function () {
            if (!checkLogin()) return;

            if (stock.textContent.split(":")[1].trim() <= 0) {
                alert("No hay stock disponible");
            } else {
                botonAgregarCarrito(producto);
                alert("Producto agregado al carrito");
                contadorIconoCarrito();
            }
        });
        botonComprarAhora(botonComprar, stock, producto);
        productosContainer.appendChild(card);
    });
}
// verifica que el producto este en el carrito, si esta lo suma la cantidad, sino lo agrega y actualiza el storage
let botonAgregarCarrito = function (producto) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex(item => item.id === producto.id);
    if (index !== -1) {
        carrito[index].cantidad += 1;
    } else {
        producto.cantidad = 1;
        carrito.push(producto);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// verifica, almacena el producto en el localStorage y redirecciona a la compra directa
function botonComprarAhora(botonComprar, stock, producto) {
    botonComprar.addEventListener("click", function () {
        if (!checkLogin()) return;
        const stockDisponible = parseInt(stock.textContent.split(":")[1].trim());
        if (stockDisponible <= 0) {
            alert("No hay stock disponible");
        } else {
            localStorage.setItem("compraDirecta", JSON.stringify(producto));
            botonAgregarCarrito(producto);
            window.location.href = "compraDirecta.html";
            contadorIconoCarrito();
        }
    });
}

// trae las tarjeta de los productos seleccionados de agregarCarrito o compraDirecta
function cargarCarrito() {
    const carritoContainer = document.getElementById("carritoContainer");
    const precio = document.getElementById("precioResumen");
    const total = document.getElementById("totalResumen");
    const carritoVacio = document.getElementById("carrito-resumen");

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    // verifica que no este vacio
    if (carrito.length === 0) {
        carritoContainer.innerHTML = "No hay productos en el carrito";
        carritoContainer.style.margin = 'auto';
        carritoVacio.style.display = "none";
        let btn = document.createElement('button');
        carritoContainer.appendChild(btn);
        btn.classList.add('continuar-compra');
        btn.textContent = "Seguir comprando";
        btn.style.margin = 'auto';
        btn.setAttribute('onclick', 'window.location.href = "productos.html"');
        return;
    }

    let totalPrecio = 0;
    carritoContainer.innerHTML = "";
    // recorre el carrito y agrega las tarjetas
    carrito.forEach(producto => {
        carritoContainer.innerHTML += `
            <div class="producto-item">
                <img src="${producto.img}" alt="${producto.descripcion}">
                <div>
                    <h6>${producto.nombre}</h6>
                    <span>${producto.descripcion}</span>
                </div>
                <div>
                    <span style="font-size: 1.2rem; font-weight: bold; color: white;">$ ${producto.precio}</span>
                </div>
                <div>
                    <div>
                        <button class="restar" ${producto.cantidad === 1 ? "disabled" : ""}>-</button>
                        <input type="number" value="${producto.cantidad}" min="1" class="input-cantidad" disabled>
                        <button class="sumar" ${producto.cantidad === producto.stock ? "disabled" : ""}>+</button>
                    </div>
                    <button type="submit" class="eliminar">Eliminar</button>
                </div>
            </div>
        `;
        totalPrecio += producto.precio * producto.cantidad;
    });

    precio.innerHTML = `<span>$</span><span>${totalPrecio}</span>`;
    total.innerHTML = `<span>$</span><span>${totalPrecio}</span>`;

    // funciones para restar, sumar y eliminar los productos del carrito

    document.querySelectorAll(".restar").forEach((btn, i) => {
        btn.addEventListener("click", () => cambiarCantidad(i, -1));
    });

    document.querySelectorAll(".sumar").forEach((btn, i) => {
        btn.addEventListener("click", () => cambiarCantidad(i, 1));
    });

    document.querySelectorAll(".eliminar").forEach((btn, i) => {
        btn.addEventListener("click", () => {
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            carrito.splice(i, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            cargarCarrito();
            contadorIconoCarrito();
        });
    });

    contadorIconoCarrito();
}

// activar las funciones
window.addEventListener("load", function () {
    if (this.window.location.href.includes("carrito.html"), ("carritoLog.html")) {
        cargarCarrito();
        contadorIconoCarrito();
    }
})

window.addEventListener("load", function () {
    if (this.window.location.href.includes("compraDirecta.html")) {
        cargarCompraDirecta();
        contadorIconoCarrito();
    }
});


// Producto listo para comprar directo
function cargarCompraDirecta() {
    const detalle = document.getElementById("detalleCompra");
    const pagoContent = document.getElementById("pagoContent");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (!carrito.length) {
        detalle.innerHTML = "<p>No hay productos para comprar.</p>";
        if (pagoContent) pagoContent.innerHTML = "";
        return;
    }
    let totalPrecio = 0;
    detalle.innerHTML = "";
    // Detalle de productos
    carrito.forEach(producto => {
        detalle.innerHTML += `
            <div class="producto-item">
                <img src="${producto.img}" alt="${producto.descripcion}">
                <div>
                    <h6>${producto.nombre}</h6>
                    <span>${producto.descripcion}</span>
                </div>
                <div>
                    <span>$ ${producto.precio}</span>
                </div>
                <div>
                    <span>Cantidad: ${producto.cantidad}</span>
                </div>
            </div>
        `;
        totalPrecio += producto.precio * producto.cantidad;
    });
    // Total
    detalle.innerHTML += `<div class="total-compra"><span>Total:</span> <span>$${totalPrecio}</span></div>`;
    // Formas de pago
    if (pagoContent) {
        pagoContent.innerHTML = `
        <div class="formulario-envio">
            <h3>Elegí el método de pago:</h3>
            <select class="form-select mb-3">
                <option value="">Seleccioná una opción</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta de crédito/débito</option>
                <option value="transferencia">Transferencia bancaria</option>
            </select>
            <h3>Elegí el método de envío:</h3>
            <select class="form-select mb-3">
                <option value="">Seleccioná una opción</option>
                <option value="retiro">Retiro en tienda</option>
                <option value="domicilio">Envío a domicilio</option>
            </select>
            <button class="btn btn-success">Confirmar y pagar</button>
        </div>
        `;
    }
}

// cambiar la cantidad del input con los botones (no baja de 1 y no pasa de stock)
function cambiarCantidad(i, j) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let producto = carrito[i];
    let nuevaCantidad = producto.cantidad + j;

    if (nuevaCantidad < 1) return;
    if (nuevaCantidad > producto.stock) {
        alert("No hay más stock disponible.");
        return;
    }

    producto.cantidad = nuevaCantidad;
    carrito[i] = producto;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
    contadorIconoCarrito();
}

// actualizar el contador del carrito
function contadorIconoCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contador = document.querySelector(".cart-count");
    if (carrito.length !== 0) {
        const cantidad = carrito.reduce((total, producto) => total + producto.cantidad, 0);
        contador.style.visibility = "visible";
        contador.textContent = cantidad;
    } else {
        contador.style.visibility = "hidden";
    }
}

// verificar si el usuario esta logueado
function checkLogin() {
    const url = window.location.href;
    const paginasLogueadas = ["productosLog.html", "indexLog.html"];

    if (!paginasLogueadas.some(pagina => url.includes(pagina))) {
        alert("Debes iniciar sesión para comprar");
        window.location.href = "login.html";
        return false;
    }
    return true;
}

// Popup de detalle de producto
function mostrarPopupProducto(producto) {
    // Si ya existe, eliminarlo
    let popupExistente = document.getElementById('popup-producto');
    if (popupExistente) popupExistente.remove();
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'popup-producto';
    overlay.innerHTML = `
      <div class="producto-detail">
        <button id="cerrar-popup-producto">&times;</button>
        <div class="producto-container">
          <div class="product-images">
            <img src="${producto.img}" alt="${producto.nombre}" class="product-main-image">
          </div>
          <div class="product-info">
            <h1 class="product-title">${producto.nombre}</h1>
            <div class="product-rating">
              <span class="rating-number">4.7</span>
              <span class="rating-stars">&#9733;&#9733;&#9733;&#9733;</span>
            </div>
            <div class="product-price">
              <span>$${producto.precio}</span>
            </div>
            <div class="stock-status">Stock disponible: ${producto.stock}</div>
            <button class="comprarAhora">Comprar Ahora</button>
            <button class="agregarCarrito">Agregar al Carrito</button>
            <div class="product-description">
              <h2>Descripción</h2>
              <div class="description-box">${producto.descripcion}</div>
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
    overlay.querySelector('.comprarAhora').onclick = function () {
        if (!checkLogin()) return;
        if (producto.stock <= 0) {
            alert('No hay stock disponible');
        } else {
            localStorage.setItem('compraDirecta', JSON.stringify(producto));
            botonAgregarCarrito(producto);
            window.location.href = 'compraDirecta.html';
            contadorIconoCarrito();
        }
    };
    overlay.querySelector('.agregarCarrito').onclick = function () {
        if (!checkLogin()) return;
        if (producto.stock <= 0) {
            alert('No hay stock disponible');
        } else {
            botonAgregarCarrito(producto);
            alert('Producto agregado al carrito');
            contadorIconoCarrito();
        }
    };
}

