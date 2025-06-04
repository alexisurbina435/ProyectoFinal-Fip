let params = new URLSearchParams(window.location.search);
let plan = params.get("plan");

//Selecciona el div donde se mostrará el contenido
let contenido = document.getElementById("contenido");

if (plan === "premium") {
  contenido.innerHTML = `
          <h1 class="titulo">Has elegido el plan premium</h1>
        <div class="contenedor-inscripcion premium">
                <div class="plan">
                    <h1>Plan Premium</h1>
                    <h3>$40.000</h3>
                </div>
                <div class="beneficios">
                    <ul class="lista-beneficios">
                        <li>Entrenamiento online libre</li>
                        <li>Entrenamiento progresivo</li>
                        <li>Clase consulta ilimitadas</li>
                        <li>Subscripcion mensual</li>
                        <li>Descuento en tienda 15%</li>
                        <li>Entrenos one-one</li>
                    </ul>
                </div>
        </div>
        
    `;
} else if (plan === "standar") {
  contenido.innerHTML = `
    <h1 class="titulo">Has elegido el plan standar</h1>
       <div class="contenedor-inscripcion standar">
                <div class="plan">
                    <h1>Plan Standar</h1>
                    <h3>$35.000</h3>
                </div>
                <div class="beneficios">
                    <ul class="lista-beneficios">
                        <li>Entrenamiento online libre</li>
                        <li>Entrenamiento progresivo</li>
                        <li>clase consulta limitadas</li>
                        <li>subscripcion mensual</li>
                        <li>descuento en tienda 10%</li>
                        <li>3 entrenos diferentes</li>
                    </ul>
                    
              </div>
        </div>
    `;
} else if (plan === "basic") {
  contenido.innerHTML = `
    <h1 class="titulo">Has elegido el plan basic</h1>
       <div class="contenedor-inscripcion basico">
                <div class="plan">
                    <h1>Plan Basic</h1>
                    <h3>$29.000</h3>
                </div>
                <div class="beneficios">
                    <ul class="lista-beneficios">
                        <li>Entrenamiento online</li>
                        <li>Entrenamiento progresivo</li>
                        <li>Clase consulta limitadas</li>
                        <li>Subscripcion mensual</li>
                        <li>Descuento en tienda 5%</li>
                        <li>Entrenos 2 veces</li>
                    </ul>
                     
                </div>
          </div>
    `;
} else {
  contenido.innerHTML = "<h2 class='error-plan'>Error: No se ha seleccionado un plan válido.</h2>";
}