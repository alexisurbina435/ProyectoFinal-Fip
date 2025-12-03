import "./inscripcionDetalle.css";
import Modal from "../detalleCompra/Modal";
import { useState } from "react";
import {FaCheck} from "react-icons/fa";
import "../compraDirecta/compraDirecta.css";
import SuscripcionButton from "../botonSuscripcion/SuscripcionButton";


export default function btnInscripcion({plan,precio,beneficio}){
        const [open,setOpen]= useState(false)
        

        
    

 return(
     <>  

    
         <button type="submit" className="btn-detalle-compra" onClick={()=> setOpen(true)}> Detalle de Compra </button>

        
     
        <Modal isOpen={open} onClose={() => setOpen(false)}>
            <h5 className="titulo-modal">Detalle de compra</h5>
            <div className="plan">
            <div>
            <div className="TipoPlan">seleccionaste el {plan}</div>
            </div>
            </div>
            <div className="precio-plan">
            <div className="precio">el valor total es de {precio}</div>
            </div>
            <div className="mostrar-beneficios">beneficions adicionales 
                 <ul>
                     <li><FaCheck className="icono-check" /> Entrenamiento progresivo</li>
                     <li><FaCheck className="icono-check" /> Clases ilimitadas</li>
                    <li><FaCheck className="icono-check" /> Descuento en tienda</li>
                    <li><FaCheck className="icono-check" /> 3 rutinas diferentes</li>
                 </ul>   
            </div>
    

                    <SuscripcionButton clase="btn-continuar-inscripcion" plan={plan} />

        </Modal>
        </>
)
}
        {/* // <ModalRegistrarse isOpen={registrarse} onClose={() => setRegistrarse(false)} >
            
        //     <form className="modal-registrarse">
                
        //         <div className="nombre">
        //         <label>
        //         <input type="nombre" required placeholder="Nombre"></input>
        //         </label>
        //         </div>
        //         <div className="apellido">
        //         <label>
        //         <input type="apellido" required placeholder="Apellido"></input>
        //         </label>
        //         </div>
        //        <div className="email-registro">
        //         <label >
        //         <input type="email-registro" required placeholder="Email"></input> 
        //         </label>
        //         </div>
        //     </form>
        //         <h6 className="telefono-contacto">telefono de contacto</h6>
        //     <form className="modal-registrarse-contacto">


        //         <div className="codigo-area">
        //         <label>
        //         <input type="text" required placeholder="Codigo de area*"></input>
        //         </label>
        //         </div>
        //         <div className="numero-tel">
        //         <label>
        //         <input type="numero" required placeholder="Numero de telefono*"></input>
        //         </label>
        //         </div>
        //         <div className="contraseña">
        //         <label>
        //         <input type="contraseña" required placeholder="Contraseña*"></input> 
        //         </label>
        //         </div>
        //         <div className="repetir-contraseña">
        //         <label>
        //         <input type="repetir-contraseña" required placeholder="Repetir contraseña*"></input> 
        //         </label>
        //         </div>
            
        //     </form>
        //       <button className="btn-registrar">Registrarme</button>
        // </ModalRegistrarse>
        //  </div> */}

  