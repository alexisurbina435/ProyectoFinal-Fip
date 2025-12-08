import React from 'react';
import './RutinaActionButtons.css';

const RutinaActionButtons = ({
  modoEdicion,
  editando,
  requiereNuevaRutina,
  tieneCambios,
  onEditar,
  onGuardarCambios,
  onGuardarComoNueva,
  onCancelar,
  onEliminar = null,
  isModal = false
}) => {
  if (!modoEdicion) return null;

  return (
    <div className="rutina-action-buttons">
      {!editando ? (
        <>
          <button
            onClick={onEditar}
            className="rutina-btn rutina-btn-edit"
          >
            Editar Rutina
          </button>
          {isModal && onEliminar && (
            <button
              onClick={onEliminar}
              className="rutina-btn rutina-btn-delete"
            >
              Eliminar Rutina
            </button>
          )}
        </>
      ) : (
        <>
          {!requiereNuevaRutina && (
            <button
              onClick={onGuardarCambios}
              disabled={!tieneCambios}
              className={`rutina-btn rutina-btn-save ${!tieneCambios ? 'rutina-btn-disabled' : ''}`}
            >
              Guardar Cambios
            </button>
          )}
          <button
            onClick={onGuardarComoNueva}
            disabled={!tieneCambios}
            className={`rutina-btn rutina-btn-save-new ${!tieneCambios ? 'rutina-btn-disabled' : ''}`}
          >
            Guardar como Nueva Rutina
          </button>
          <button
            onClick={onCancelar}
            className="rutina-btn rutina-btn-cancel"
          >
            Cancelar
          </button>
        </>
      )}
    </div>
  );
};

export default RutinaActionButtons;

