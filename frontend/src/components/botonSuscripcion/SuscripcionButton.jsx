// SuscripcionButton.tsx
import suscripcionService from '../../services/suscripcion.service';
import usuarioService from '../../services/usuario.service';
import planService from "../../services/plan.service.js";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
function SuscripcionButton({ clase, plan }) {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
    const usuario = await usuarioService.getUsuarioById();
    let planData;
    if (plan.toLowerCase().includes("premium")) {
      planData = await planService.getPlanById(3);
    } else if (plan.toLowerCase().includes("standard")) {
      planData = await planService.getPlanById(2);
    } else if (plan.toLowerCase().includes("basic")) {
      planData = await planService.getPlanById(1);
    }
    const suscripcionActiva = usuario.suscripciones?.find(s => s.estado === "ACTIVA");
    if (suscripcionActiva) {
      Swal.fire({
        title: "Cambiar Suscripcion",
        text: "¿Estas seguro de cambiar tu suscripcion?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085D6",
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
      Swal.fire({
        title: "Confirmar Suscripcion",
        text: "¿Deseas continuar con el plan seleccionado?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085D6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Continuar",
        cancelButtonText: "Cancelar"
      }).then(async (result) => {
        if (result.isConfirmed) {
          const suscripcion = await suscripcionService.create({
            id_usuario: usuario.id_usuario,
            id_plan: planData.id_plan,
            mesesContratados: 1
          });
          console.log("suscripción creada");
          window.location.href = suscripcion.init_point;
        }
      });
    }
  }
    catch (error) {
      console.error("Error al obtener el usuario:", error);
      Swal.fire({
        title: "Atención",
        text: "Para continuar Inicie sesión.",
        icon: "warning",
        navigator: true,
        confirmButtonText: "Ir al inicio de sesión",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        confirmButtonColor: "#3085D6",
        cancelButtonColor: "#d33",
      }).then((async(result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      }));
    }
  };
  return (
    <button className={clase} plan={plan} onClick={handleClick}>
      Continuar Inscripcion
    </button>
  );
}
export default SuscripcionButton;

