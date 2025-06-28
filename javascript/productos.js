
// array de productos 
let arrayProductos =[]; 
// seleccionamos el id de lista productos para poder acceder a article completo donde se alojan los productos 
const listaProductos = document.querySelector("#listaProductos");

document.addEventListener('DOMContentLoaded', function() {
  eventListeners();
});
// agrega un event en las card
function eventListeners(){
  listaProductos.addEventListener("click", getDataElements)

}
// reccorre el DOM
function getDataElements(e){
  if(e.target.classList.contains('boton-Carrito')){
    const elementHtml = e.target.parentElement.parentElement.parentElement;
    selectData(elementHtml)
  }

}
// selecciona los datos de producto y si existe lo actualiza
function selectData(producto){
  const idProducto = parseInt(producto.closest('article').id, 10);
   const existente = arrayProductos.find(p => p.id === idProducto);

  if (existente) {
    existente.quantity++;
    actualizarContadorCarrito();
  } else {
  const productoObj = {
    img: producto.querySelector('img').src,
    tittle: producto.querySelector('h5').textContent,
    price : parseFloat(producto.querySelector('span.precio-actual').textContent.replace('$', '')),
    id : parseInt(producto.closest('article').id,10),
    quantity: 1
  };

  arrayProductos = [...arrayProductos, productoObj];
 actualizarContadorCarrito()
 console.log(arrayProductos)
}
}
// actualiza el contador del carrito
function actualizarContadorCarrito() {
  const contador = document.querySelector("#contador-carrito");
  const totalCantidad = arrayProductos.reduce((total, producto) => total + producto.quantity, 0);
  contador.textContent = totalCantidad;
}












// const botonesCarrito = document.querySelectorAll(".boton-Carrito");
// botonesCarrito.forEach(boton => {
//   boton.addEventListener("click", e => {
//     const agregarProducto=(e.target.classList.contains("boton-Carrito"))
//       Productos =[...Productos, agregarProducto]
  
//   });
// });
// })



  // function actualizarContador() {
  //   if (contadorCarrito) {
  //     contadorCarrito.textContent = cantidad.toString();
  //   }
  // }

  // if (botonesCarrito) {
  //   botonesCarrito.addEventListener("click", () => {
  //     cantidad++;
  //     mensaje.textContent = "✅ Producto agregado al carrito";
  //     mensaje.style.color = "green";
  //     actualizarContador();

  //     setTimeout(() => {
  //       mensaje.textContent = "";
  //     }, 2000);
  //   });
  // }

  // if (sacarDelCarrito) {
  //   sacarDelCarrito.addEventListener("click", () => {
  //     if (cantidad > 0) {
  //       cantidad--;
  //       mensaje.textContent = "✅ Producto eliminado del carrito";
  //       mensaje.style.color = "green";
  //       actualizarContador();

  //       setTimeout(() => {
  //         mensaje.textContent = "";
  //       }, 2000);
  //     }
  //   });
  // }


// // si el usuario no esta registrado redirige a la pagina de crear usuario 
// botonesComprar.forEach((boton) => {
//     boton.addEventListener("click", ()=>{
//     const usuarioLogueado = localStorage.getItem("usuarioLogueado") === "true";
    
//     if (!usuarioLogueado) {
//       // Si no está logueado, redirigimos
//       window.location.href = "register.html";
//     } else {
//       // Usuario registrado, continuar con la compra
//       const nombre = localStorage.getItem("nombreUsuario");
//       alert("puede continuar con el proceso de su compra, " + nombre + "!");
//     }
//     function comprar(){

// }

//     });
// });
// })

