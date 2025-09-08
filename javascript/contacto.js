let nombreCompleto = document.getElementById("nombre");
let correo = document.getElementById("email");
let consulta = document.getElementById("consulta");
let Formulario = document.getElementById("formulario");

let favDialog = document.getElementById("favDialog");
let closeBtn = document.getElementById("closeModal");
let overlay = document.getElementById("overlay");

let informacion = [];

Formulario.addEventListener("submit", (e) => {
    informacion[0] = `Su nombre y apellido es: ${nombreCompleto.value} `;
    informacion[1] = `\nEl correo electronico es: ${correo.value} `;
    informacion[2] = `\nSu consulta es: ${consulta.value}`;

    let validacionNombre = /^[a-zA-ZéÉáÁíóúÍÓÚÑñ\s]*$/;
    let email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{3,4}$/i;
    if (!nombreCompleto.value || !correo.value || !consulta.value) {
        e.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, complete todas las casillas',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }

    if (nombreCompleto.value.length < 6) {
        e.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: 'Nombre muy corto',
            text: 'Ingrese nombre y apellido con 6 caracteres o más',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }

    if (!validacionNombre.test(nombreCompleto.value)) {
        e.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Nombre inválido',
            text: 'Nombre y apellido no válidos, no se permiten números ni caracteres especiales',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }

    if (!email.test(correo.value)) {
        e.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Email inválido',
            text: 'Correo electrónico no válido',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }

    if (consulta.value.length < 10) {
        e.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: 'Consulta muy corta',
            text: 'Ingrese 10 caracteres o más para su consulta',
            confirmButtonColor: '#ee5f0d'
        });
        return;
    }

    // Swal.fire({
    //     icon: 'success',
    //     title: '¡Formulario enviado!',
    //     text: 'Tu consulta ha sido enviada correctamente. Te responderemos en menos de 24 horas hábiles.',
    //     confirmButtonColor: '#ee5f0d'
    // });
    // alert("Formulario enviado");
    e.preventDefault();
    favDialog.showModal();
    overlay.classList.toggle('overlay-block');
    let blob = new Blob([informacion], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "contacto.txt");

    closeBtn.addEventListener("click", () => {
        favDialog.close();
        setTimeout(() => {
            window.location.reload();
        }, 400);
    });

})