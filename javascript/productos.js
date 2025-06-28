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


        /*card.querySelector(".card-producto").addEventListener("click", () => {
            localStorage.setItem("productoDetalle", JSON.stringify(producto));
            if (checkLogin()) {
                window.location.href = "productoDetalladoLog.html";
            } else {
                window.location.href = "productoDetallado.html";
            }
        });*/


        const botonAgregar = card.querySelector(".agregarCarrito");
        const botonComprar = card.querySelector(".comprarAhora");
        const stock = card.querySelector(".stock");

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

function checkLogin() {
    if (!this.window.location.href.includes("productosLog.html")) {
        alert("Debes iniciar sesión para comprar");
        window.location.href = "login.html";
        return false;
    } else {
        return true;
    }
}