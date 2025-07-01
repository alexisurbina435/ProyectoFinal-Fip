let usuario = JSON.parse(localStorage.getItem("usuarioLog")) || false;

if (!usuario) {
    window.location.href = "login.html";
}

let logout = document.getElementById("logout");
logout.addEventListener("click", () => {
    alert("Hasta pronto!");
    localStorage.removeItem("usuarioLog");
    localStorage.removeItem("carrito");
    window.location.href = "index.html";
})