let usuario = JSON.parse(localStorage.getItem("usuarioLog")) || false;

if (!usuario) {
    window.location.href = "login.html";
}

let logout = document.getElementById("logout");
logout.addEventListener("click", () => {
    Swal.fire({
        icon: 'info',
        title: '¡Hasta pronto!',
        text: 'Has cerrado sesión correctamente',
        confirmButtonColor: '#ee5f0d'
    }).then(() => {
        localStorage.removeItem("usuarioLog");
        localStorage.removeItem("carrito");
        window.location.href = "index.html";
    });
})