const carousel = document.getElementById("carousel");
const btnNext = document.querySelector(".btn-next");
const btnPrev = document.querySelector(".btn-prev");

const scrollAmount = 250; // cantidad de px que se desliza

btnNext.addEventListener("click", () => {
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
});

btnPrev.addEventListener("click", () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
});

