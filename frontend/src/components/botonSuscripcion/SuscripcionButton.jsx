// SuscripcionButton.tsx
import React from 'react';
import suscripcionService from '../../services/suscripcion.service';
import usuarioService from '../../services/usuario.service';
import planService from "../../services/plan.service.js";

function SuscripcionButton({ clase,plan }) {
  const handleClick = async () => {
    const usuario = await usuarioService.getUsuarioById();

    let planData;
    if (plan.toLowerCase().includes("premium")) {
      planData = await planService.getPlanById(1);
    } else if (plan.toLowerCase().includes("standard")) {
      planData = await planService.getPlanById(2);
    } else if (plan.toLowerCase().includes("basic")) {
      planData = await planService.getPlanById(3);
    }

    const suscripcion = await suscripcionService.create({
      id_usuario: usuario.id_usuario,
      id_plan: planData.id_plan,
      mesesContratados: 1
    });

    window.location.href = suscripcion.init_point;
  };

  return (
    <button className={clase} plan={plan} onClick={handleClick}>
      Continuar Inscripcion
    </button>
  );
}

export default SuscripcionButton;

