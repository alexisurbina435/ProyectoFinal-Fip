// import "./ModalRegistrarse.css";
// import React from "react";

// export default function ModalRegistrarse({ isOpen, onClose, children }) {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-registro" onClick={onClose}>
//       <div
//         className="modal-contenedorRegistro"
        
//         onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer click adentro
//       >
//         <h2>registrarse</h2>
//         <p>ingresa tus datos para crear tu cuenta</p>
//         <button className="close-btn" onClick={onClose}>
//           X
//         </button>

//         {children}
//       </div>
//     </div>
//   );
// }