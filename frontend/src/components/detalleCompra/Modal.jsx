import "./Modal.css";
import React from "react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content-detalle-compra"
        onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer click adentro
      >
        <button className="close-btn" onClick={onClose}>
          X
        </button>

        {children}
      </div>
    </div>
  );
}