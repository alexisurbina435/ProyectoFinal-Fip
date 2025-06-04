
//inputs del formulario
let suEdad = document.getElementById("edad");
let documento = document.getElementById("dni");
let fechaNacimiento = document.getElementById("fecha-nacimiento");
let direccionInput = document.getElementById("direccion");
let ciudadInput = document.getElementById("ciudad");
let provInput = document.getElementById("provincia");
let codigoInput = document.getElementById("codigo-postal");
let paisInput = document.getElementById("pais");

//Textareas de los checkbox
let lesionInput = document.getElementById("lesion");
let medicamentoInput = document.getElementById("medicamento");
let objetivoInput = document.getElementById("objetivo");

//checkbox de si y no
let condicionSi = document.getElementById("si-condicion");
let condicionNo = document.getElementById("no-condicion");
let medicacionSi = document.getElementById("si-medicacion");
let medicacionNo = document.getElementById("no-medicacion");
let ExpSi = document.getElementById("si-entreno");
let ExpNo = document.getElementById("no-entreno");

//formulario
let Formulario = document.getElementById("formulario");

//modal
let favDialog = document.getElementById("favDialog");
let closeBtn = document.getElementById("closeModal");
let overlay = document.getElementById("overlay");


let informacion = [];


Formulario.addEventListener("submit", (e) => {
    const campos = [
        { label: "Edad", value: suEdad.value, min: 1 },
        { label: "DNI", value: documento.value, min: 7 },
        { label: "Fecha de nacimiento", value: fechaNacimiento.value },
        { label: "Dirección", value: direccionInput.value, min: 2 },
        { label: "Ciudad", value: ciudadInput.value, min: 4 },
        { label: "Provincia", value: provInput.value, min: 4 },
        { label: "Código postal", value: codigoInput.value, min: 4 },
        { label: "País", value: paisInput.value, min: 5 },
        { label: "Objetivo", value: objetivoInput.value, min: 4 },
    ];

    const checkboxes = [
        { label: "Padece alguna condicion medica", si: condicionSi, no: condicionNo },
        { label: "Toma algún medicamento", si: medicacionSi, no: medicacionNo },
        { label: "Tiene experiencia entrenando", si: ExpSi, no: ExpNo }
    ];

    const textareas = [
        { label: "Condicion medica", value: lesionInput.value, min: 7 },
        { label: "Medicamento que consume", value: medicamentoInput.value, min: 7 },
    ]

    let informacion = [];

    //Validando inputs del formulario
    for (let campo of campos) {
        if (!campo.value.trim() || (campo.min && campo.value.length < campo.min)) {
            e.preventDefault();
            alert(`Ingrese ${campo.min} caracteres o más para ${campo.label}.`);
            return;
        }
        informacion.push(`\n${campo.label}: ${campo.value}`);
    }

    //Validando selección de checkboxes
    for (let checkbox of checkboxes) {
        if (!checkbox.si.checked && !checkbox.no.checked) {
            e.preventDefault();
            alert(`Por favor, seleccione 'Sí' o 'No' en ${checkbox.label}.`);
            return;
        }
        if (checkbox.si.checked && checkbox.no.checked) {
            e.preventDefault();
            alert(`Solo puede seleccionar una opción: 'Sí' o 'No' en ${checkbox.label}.`);
            return;
        }
        informacion.push(`\n${checkbox.label}: ${checkbox.si.checked ? "Sí" : "No"}`);
    }

    //Validando textarea si marca "Sí"
    if (condicionSi.checked && lesionInput.value.trim().length < 7) {
        e.preventDefault();
        alert("Ingrese 7 caracteres o más para explicar su lesión.");
        lesionInput.focus();
        return;
    //Pushea la informacion del textarea si el usuario marco "Sí" y si puso "No" lo deja vacio
    }else{
        informacion.push(`\n${textareas[0].label}: ${textareas[0].value ? textareas[0].value : ""}  `);
    }

    if (medicacionSi.checked && medicamentoInput.value.trim().length < 7) {
        e.preventDefault();
        alert("Ingrese 7 caracteres o más para explicar qué medicamento toma.");
        medicamentoInput.focus();
        return;
    //Pushea la informacion del textarea si el usuario marco "Sí" y si puso "No" lo deja vacio
    }else{
        informacion.push(`\n${textareas[1].label}: ${textareas[1].value ? textareas[1].value : ""}   `);

    }

    //Guardar datos y mostrar modal
    e.preventDefault();
    favDialog.showModal();
    overlay.classList.toggle('overlay-block');
    let blob = new Blob([informacion], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "contacto.txt");

    //Cerrar modal y recargar pagina
    closeBtn.addEventListener("click", () => {
        favDialog.close();
        setTimeout(() => { window.location.reload(); }, 600);
    });
});

// Formulario.addEventListener("submit", (e) => {
//     informacion[0] = `Edad: ${suEdad.value} `;
//     informacion[1] = `\nDNI: ${documento.value} `;
//     informacion[2] = `\nFecha de nacimiento: ${fechaNacimiento.value}`;
//     informacion[3] = `\nDireccion: ${direccionInput.value}`;
//     informacion[4] = `\nCiudad: ${ciudadInput.value}`;
//     informacion[5] = `\nProvincia: ${provInput.value}`;
//     informacion[6] = `\nCodigo postal: ${codigoInput.value}`;
//     informacion[7] = `\nPais: ${paisInput.value}`;
//     if (condicionSi.checked) {
//         informacion[8] = `\nHa sufrido una lesión: si`;
//     } else if (condicionNo.checked) {
//         informacion[9] = `\nHa sufrido una lesión: no`;
//     }
//     informacion[10] = `\nLesion que ha sufrido: ${lesionInput.value}`;
//     if (medicacionSi.checked) {
//         informacion[11] = `\nToma algun medicamento: si`;
//     } else if (medicacionNo.checked) {
//         informacion[12] = `\nToma algun medicamento: no`;
//     }
//     informacion[13] = `\nMedicamento que consume: ${medicamentoInput.value}`;
//     if (ExpSi.checked) {
//         informacion[14] = `\nTiene experiencia entrenando: si`;
//     } else if (ExpNo.checked) {
//         informacion[15] = `\nTiene experiencia entrenando: no`;
//     }
//     informacion[16] = `\nSu objetivo es: ${objetivoInput.value}`;

//     if (suEdad.value == "" || documento.value == "" || fechaNacimiento.value == "" || direccionInput.value == "" || ciudadInput.value == "" || provInput.value == "" ||
//         codigoInput.value == "" || paisInput.value == "" ) {

//         e.preventDefault();
//         alert("Por favor, complete todas las casillas");
//     } else if (suEdad.value < 13) {
//         e.preventDefault();
//         alert("Solo mayores de 13 años");
//     } else if (documento.value.length < 7) {
//         e.preventDefault();
//         alert("Su DNI debe tener almenos 7 caracteres");
//     } else if (direccionInput.value.length < 2) {
//         e.preventDefault();
//         alert("Ingrese 2 caracteres o más para su direccion");
//     }
//     else if (ciudadInput.value.length < 4) {
//         e.preventDefault();
//         alert("Ingrese 4 caracteres o más para su ciudad");
//     } else if (provInput.value.length < 4) {
//         e.preventDefault();
//         alert("Ingrese 4 caracteres o más para su provincia");
//     } else if (codigoInput.value.length < 4) {
//         e.preventDefault();
//         alert("Ingrese 4 caracteres o más para su codigo postal");
//     } else if (paisInput.value.length < 5) {
//         e.preventDefault();
//         alert("Ingrese 5 caracteres o más para su pais");
//     }
//     else if (!condicionSi.checked && !condicionNo.checked || !medicacionSi.checked && !medicacionNo.checked || !ExpSi.checked && !ExpNo.checked) {
//         e.preventDefault();
//         alert("Por favor, seleccione 'Sí' o 'No' en cada pregunta.");
//     } else if (condicionSi.checked && condicionNo.checked) {
        
//         alert("Marque una sola opción en ¿padece alguna condicion medica?");

//     }else if ( medicacionSi.checked && medicacionNo.checked ) {
//         alert("Marque una sola opción en ¿esta tomando algun tipo de medicamento?");

//     } else if (ExpSi.checked && ExpNo.checked) {
//         alert("Marque una sola opción en ¿tiene experiencia entrenando?");

//     }  else if (condicionSi.checked && lesionInput.value == "") {
//         e.preventDefault();
//         alert("Por favor ingrese 7 caracteres o más para explicar su condición medica");

//     } else if (medicacionSi.checked && medicamentoInput.value == "") {
//         e.preventDefault();
//         alert("Por favor ingrese 7 caracteres o más para explicar el medicamento que consume");
//     }else if( objetivoInput.value == ""){
//         e.preventDefault();
//         alert("Por favor complete el campo Objetivos");
//     }
//      else if (objetivoInput.value.length < 4) {
//         e.preventDefault();
//         alert("Por favor ingrese 7 caracteres o más para explicar su objetivo");
//     } else {

//         e.preventDefault();
//         favDialog.showModal();
//         overlay.classList.toggle('overlay-block');
//         let blob = new Blob([informacion], { type: "text/plain;charset=utf-8" });
//         saveAs(blob, "contacto.txt");

//     }
//     closeBtn.addEventListener("click", () => {
//         favDialog.close();
//         setTimeout(() => {
//             window.location.reload();
//         }, 400);
//     });

// })

