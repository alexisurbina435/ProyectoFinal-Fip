"use strict";
//seleccionamos todas las card de blog.html
const cardAll = document.querySelectorAll(".card");

cardAll.forEach((card) => {
  card.addEventListener("click", () => {
    const img = card.querySelector("img").src;
    const title = card.querySelector(".titulo-card").textContent;
    const glosario = card.querySelector(".glosario-card").textContent;
    const contenido = card.querySelector(".contenido-card").textContent;

    // Guardamos todo en localStorage
    localStorage.setItem(
      "temaSeleccionado",
      JSON.stringify({
        img,
        title,
        glosario,
        contenido,
      })
    );
    // la informacion la  enviamos a blogDetalle.html
    window.location.href = "blogDetalle.html";
  });
});
