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
