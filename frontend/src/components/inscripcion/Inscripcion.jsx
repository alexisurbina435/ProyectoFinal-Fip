import "./inscripcion.css";
import CardInscripcion from "../card-inscripcion/CardInscripcion.jsx";
import planService from "../../services/plan.service.js";
import { useState, useEffect } from "react";

export default function Inscripcion() {
  const beneficios = [
    { id: "premium", beneficios: ["Entrenadores Online libre", "Entrenamiento Progresivo", "Clase consulta ilimitadas", "Subscripción mensual", "Descuento en tienda 15%", "Entrenos one-one"] },
    { id: "standard", beneficios: ["Entrenadores Online libre", "Entrenamiento Progresivo", "Clase consulta limitadas", "Subscripcion mensual", "Descuento en tienda 10%", "3 entrenos diferentes"] },
    { id: "basic", beneficios: ["Entrenamiento online", "Entrenamiento progresivo", "Clase consulta limitadas", "Subscripcion mensual", "Descuento en tienda 5%", "Entrenos 2 veces"] }
  ];

  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    const fetchPlanes = async () => {
      const planesNombre = await planService.getAllPlans();
      setPlanes(planesNombre);
    };
    fetchPlanes();
  }, []);

  return (
    <section className="inscribite">
      <div className="titulo">
        <h1>Elegí el plan de tu preferencia.</h1>
        <h3 className="subtitulo">¡Eleva tu nivel! Encuentra el plan perfecto para alcanzar tus objetivos.</h3>
      </div>

      <div className="inscripcion">
        {planes.map((plan) => {
          const beneficiosPlan = beneficios.find(
            (bene) => bene.id === plan.nombre.toLowerCase()
          )?.beneficios;

          return (
            <CardInscripcion
              key={plan.id_plan}
              clase={plan.nombre.toLowerCase()}
              plan={`Plan ${plan.nombre}`}
              precio={`$${plan.precio}`}
              beneficio={beneficiosPlan} 
            />
          );
        })}
      </div>
    </section>
  );
}
