fetch('../data/listaProductos.json')
    .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
        return response.json();
    })
    .then(data => {
        llenarProductos(data);
    })
    .catch(error => {
        console.error("Error al cargar el JSON:", error);
    });

//Funcion para llenar los productos
let llenarProductos = function (data) {
    const productosContainer = document.getElementById("productosContainer");
    if (!productosContainer) {
        console.error("No se encontró el contenedor de productos.");
        return;
    }

    data.forEach(producto => {
        const card = document.createElement("article");
        card.classList.add("col-12", "col-md-3") ;
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

        const botonComprar = card.querySelector(".comprarAhora");
        const stock = card.querySelector(".stock");
        botonComprar.addEventListener("click", function () {
            if (stock.innerHTML <= 0) {
                alert("No hay stock disponible");
            } else {
                localStorage.setItem("producto", JSON.stringify(producto));
                window.location.href = "carrito.html";
            }
        });
        productosContainer.appendChild(card);
    });
}

let agregarCarrito = function () {
    const agregarCarrito = document.getElementById("agregarCarrito");

}


function cargarCarrito() {
    const carritoContainer = document.getElementById("carritoContainer");
    const precio = document.getElementById("precioResumen");
    const total = document.getElementById("totalResumen");

    const productoJSON = localStorage.getItem("producto");
    if (!productoJSON) {
        carritoContainer.innerHTML = "<p>No hay productos en el carrito.</p>";
        return;
    }

    const producto = JSON.parse(productoJSON);
    carritoContainer.innerHTML = `
        <img src="${producto.img}" alt="${producto.descripcion}">
            <div>
                <h6>${producto.nombre}</h6>
                <span>${producto.descripcion}</span>
            </div>
            <div>
                <button id="eliminar"></button>
                <div>
                    <button id="restar"></button>
                    <input type="number" id="cantidad" value="1">
                    <button id="sumar"></button>
                </div>
            </div>
            `;
    precio.innerHTML += `<span>$</span><span>${producto.precio}</span>`
    total.innerHTML += `<span>$</span><span>${producto.precio}</span>`
}

window.addEventListener("load", function () {
    if (this.window.location.href.includes("carrito.html")) {
        cargarCarrito();
    }
})