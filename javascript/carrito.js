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
        card.classList.add("col-12", "col-md-3");
        card.innerHTML += `
                    <div class="card h-100 text-center">
                        <img decoding="async" src="${producto.img}" class="carrusel dinamico img-thumbnail"
                            alt="${producto.descripcion}" />
                        <div class="card-body">
                            <h5 class="producto-nombre">${producto.nombre}</h5>
                            <span class="descripcion">${producto.descripcion}</span>
                            <div class="estrellas">
                                <i class="fa-solid fa-star icon-star"></i>
                                <i class="fa-solid fa-star icon-star"></i>
                                <i class="fa-solid fa-star icon-star"></i>
                                <i class="fa-solid fa-star icon-star"></i>
                                <i class="fa-solid fa-star icon-star"></i>
                            </div>
                            <span class="precio"><span>$</span> ${producto.precio}</span>
                            <span class="stock">Stock disponible: ${producto.stock}</span>
                            <div class="botones">
                                <button class="comprarAhora">Comprar Ahora</button>
                                <button class="agregarCarrito">Agregar al Carrito</button>
                            </div>
                        </div>
                    </div>
                `;

        const botonAgregar = card.querySelector(".agregarCarrito");
        const botonComprar = card.querySelector(".comprarAhora");
        const stock = card.querySelector(".stock");

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
    const producto = JSON.parse(localStorage.getItem("compraDirecta"));
    const detalle = document.getElementById("detalleCompra");
  
    if (!producto) {
        detalle.innerHTML = "<p>No hay productos para comprar.</p>";
        return;
    }

    // Mostrar detalles y paso a paso de compra
    detalle.innerHTML = `
        <div class="producto-envio card p-3 mb-4">
            <img src="${producto.img}" alt="${producto.descripcion}" class="img-fluid mb-2">
            <h4>${producto.nombre}</h4>
            <p>${producto.descripcion}</p>
            <p><strong>Precio:</strong> $${producto.precio}</p>
        </div>

        <div class="formulario-envio">
            <h5>Elegí el método de envío:</h5>
            <select class="form-select mb-3">
                <option value="">Seleccioná una opción</option>
                <option value="retiro">Retiro en tienda</option>
                <option value="domicilio">Envío a domicilio</option>
            </select>

            <h5>Confirmar pago:</h5>
            <button class="btn btn-success">Pagar ahora</button>
        </div>
    `;
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

