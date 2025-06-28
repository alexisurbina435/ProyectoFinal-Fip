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

    contadorIconoCarrito();
}

// activar las funciones
window.addEventListener("load", function () {
    if (this.window.location.href.includes("carrito.html"),("carritoLog.html")) {
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

