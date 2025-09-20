document.addEventListener("DOMContentLoaded", () => {
  const tema = JSON.parse(localStorage.getItem("temaSeleccionado"));

  if (!tema) return;

  document.getElementById("imagen-detalle").src = tema.img;
  document.getElementById("titleCard").textContent = tema.title;
  document.querySelector(".card-glosario").textContent = tema.glosario;
  document.querySelector(".cards-grande").textContent = tema.contenido;

  const cardGlosario = document.querySelector(".card-glosario");
  cardGlosario.textContent = tema.glosario;

  const cardContenido = document.querySelector(".card-grande");
  cardContenido.textContent = tema.contenido;
  console.log(cardContenido);
});
