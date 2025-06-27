// Traer el json
fetch('../data/listaProductos.json')
    .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
        return response.json();
    })
    .then(data => {
        if (window.location.pathname.includes("productos.html"),("productosLog.html")) {
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
        img.addEventListener('click', function() {
            mostrarPopupProducto(producto);
        });

        // Verifica stock y activa la funcion de agregar
        botonAgregar.addEventListener("click", function () {
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
    
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    // verifica que no este vacio
    if (carrito.length === 0) {
        carritoContainer.innerHTML = "No hay productos en el carrito";
        precio.innerHTML = `<span>$</span><span> 0</span>`;
        total.innerHTML = `<span>$</span><span> 0</span>`;
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
                    <span>$ ${producto.precio}</span>
                </div>
                <div>
                    <button type="submit" class="eliminar">Eliminar</button>
                    <div>
                        <button class="restar" ${producto.cantidad === 1 ? "disabled" : ""}>-</button>
                        <input type="number" value="${producto.cantidad}" min="1" class="input-cantidad" disabled>
                        <button class="sumar" ${producto.cantidad === producto.stock ? "disabled" : ""}>+</button>
                    </div>
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
}

// activar las funciones
window.addEventListener("load", function () {
    if (this.window.location.href.includes("carrito.html"),("carritoLog.html")) {
        cargarCarrito();
    }
})

window.addEventListener("load", function () {
    if (this.window.location.href.includes("compraDirecta.html")) {
        cargarCompraDirecta();
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

