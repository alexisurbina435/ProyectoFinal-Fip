import BtnInscripcionDetalle from "./BtnInscripcionDetalle";
import CardInscripcion from "../card-inscripcion/CardInscripcion";
import MetodoPago from "../metodoPago/MetodoPago";
import { useLocation } from "react-router-dom";
import "./inscripcionDetalle.css";
// import "../metodoPago/metodoPago.css";
// import "./inscripcion.css";



export default function inscripcionDetalle (){
const { state } = useLocation();
  const { plan, precio, beneficio } = state || {};
  


  if (!plan) return <h1>No se seleccionó ningún plan</h1>;
 

    return(
 
        <>
        <section className="contenido">
        <h1 className="titulo">Has elegido {plan}</h1>
        <div class="contenedor-inscripcion">
        <CardInscripcion plan={plan} precio={precio} beneficio={beneficio} mostrarBotonInicial={false}
        clase={
                plan.toLowerCase().includes("basico") ? "basico" :
                plan.toLowerCase().includes("standar") ? "standar" :
               "premium"
        }
        
        />
        </div>
        
        </section>
        <section className="finalizar-compra">
        <BtnInscripcionDetalle/>  
        </section>
        <MetodoPago/>
        
        </>




    )



}