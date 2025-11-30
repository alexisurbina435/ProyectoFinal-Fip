// SuscripcionButton.tsx
import React from 'react';
import suscripcionService from '../../services/suscripcion.service';
import usuarioService from '../../services/usuario.service';
import planService from "../../services/plan.service.js";
import Swal from "sweetalert2";
function SuscripcionButton({ clase, plan }) {
  const handleClick = async () => {
    const usuario = await usuarioService.getUsuarioById(id);

    let planData;
    if (plan.toLowerCase().includes("premium")) {
      planData = await planService.getPlanById(1);
    } else if (plan.toLowerCase().includes("standard")) {
      planData = await planService.getPlanById(2);
    } else if (plan.toLowerCase().includes("basic")) {
      planData = await planService.getPlanById(3);
    }

    const suscripcionActiva = usuario.suscripciones?.find(s => s.estado === "Activa");

    if (suscripcionActiva) {
      Swal.fire({
        title: "Cambiar Suscripcion",
        text: "¿Estas seguro de cambiar tu suscripcion?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, cambiar",
        cancelButtonText: "Cancelar"
      }).then(async (result) => {
        if (result.isConfirmed) {
          const suscripcion = await suscripcionService.cambiarPlan(
            usuario.id_usuario,
            planData.id_plan,
            { mesesContratados: 1 }
          );
          console.log("suscripción cambiada");
          window.location.href = suscripcion.init_point;
        }
      });
    } else {
      const suscripcion = await suscripcionService.create({
        id_usuario: usuario.id_usuario,
        id_plan: planData.id_plan,
        mesesContratados: 1
      });
      console.log("suscripción creada");
      window.location.href = suscripcion.init_point;
    }
  };
  


  return (
    <button className={clase} plan={plan} onClick={handleClick}>
      Continuar Inscripcion
    </button>
  );
}

export default SuscripcionButton;

