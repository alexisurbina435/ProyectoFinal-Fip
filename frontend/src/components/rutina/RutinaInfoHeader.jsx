import React from 'react';
import './RutinaInfoHeader.css';

const RutinaInfoHeader = ({
  rutina,
  modoEdicion,
  editando,
  datosEditados,
  usuarios,
  requiereNuevaRutina,
  onEditarCampo,
  isModal,
  onClose
}) => {
  const nivelActual = datosEditados.nivel !== undefined ? datosEditados.nivel : rutina.nivel;
  const categoriaActual = datosEditados.categoria !== undefined ? datosEditados.categoria : rutina.categoria;
  const tipoRutinaActual = datosEditados.tipo_rutina !== undefined ? datosEditados.tipo_rutina : rutina.tipo_rutina;
  const usuarioActualId = datosEditados.id_usuario !== undefined ? datosEditados.id_usuario : (rutina.usuario?.id_usuario || null);
  const nombreActual = datosEditados.nombre !== undefined ? datosEditados.nombre : rutina.nombre;
  const descripcionActual = datosEditados.descripcion !== undefined ? datosEditados.descripcion : rutina.descripcion;

  const handleTipoChange = (nuevoTipo) => {
    onEditarCampo('tipo_rutina', nuevoTipo);
    if (nuevoTipo === 'general') {
      onEditarCampo('id_usuario', null);
      onEditarCampo('categoria', null);
    } else if (nuevoTipo === 'plan') {
      onEditarCampo('id_usuario', null);
    }
  };

  return (
    <div className="rutina-view-info rutina-info-header">
      {isModal && onClose && (
        <button
          onClick={onClose}
          className="rutina-view-close-btn rutina-info-close-btn"
        >
          ×
        </button>
      )}
      
      {/* Nombre */}
      <div className="rutina-info-field">
        <label className="rutina-info-label">Nombre:</label>
        {modoEdicion && editando ? (
          <input
            type="text"
            value={nombreActual}
            onChange={(e) => onEditarCampo('nombre', e.target.value)}
            className="rutina-info-input rutina-info-input-name"
            placeholder="Nombre de la rutina"
          />
        ) : (
          <p className="rutina-info-text rutina-info-text-name">
            {rutina.nombre || 'Sin nombre'}
          </p>
        )}
      </div>

      {/* Descripción */}
      <div className="rutina-info-field">
        <label className="rutina-info-label">Descripción:</label>
        {modoEdicion && editando ? (
          <textarea
            value={descripcionActual}
            onChange={(e) => onEditarCampo('descripcion', e.target.value)}
            className="rutina-info-textarea"
            placeholder="Descripción de la rutina"
          />
        ) : (
          <p className={`rutina-info-text ${!rutina.descripcion ? 'rutina-info-text-italic' : ''}`}>
            {rutina.descripcion || 'Sin descripción'}
          </p>
        )}
      </div>

      {/* Nivel, Tipo, Categoría, Cliente */}
      <div className="rutina-info-metadata">
        {/* Nivel */}
        <div className="rutina-info-metadata-item">
          <label className="rutina-info-label">Nivel:</label>
          {modoEdicion && editando ? (
            <select
              value={nivelActual}
              onChange={(e) => onEditarCampo('nivel', e.target.value)}
              className="rutina-info-select"
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
              <option value="personalizado">Personalizado</option>
            </select>
          ) : (
            <p className="rutina-info-text">
              {rutina.nivel ? rutina.nivel.charAt(0).toUpperCase() + rutina.nivel.slice(1) : 'N/A'}
            </p>
          )}
        </div>

        {/* Tipo */}
        <div className="rutina-info-metadata-item">
          <label className="rutina-info-label">Tipo:</label>
          {modoEdicion && editando ? (
            <select
              value={tipoRutinaActual}
              onChange={(e) => handleTipoChange(e.target.value)}
              className="rutina-info-select"
            >
              <option value="general">General</option>
              <option value="cliente">Cliente</option>
              <option value="plan">Plan</option>
            </select>
          ) : (
            <p className="rutina-info-text">
              {rutina.tipo_rutina === 'general' ? 'General' : 
               rutina.tipo_rutina === 'cliente' ? 'Cliente' : 
               rutina.tipo_rutina === 'plan' ? 'Plan' : 'N/A'}
            </p>
          )}
        </div>

        {/* Categoría (solo para tipo plan) */}
        {(tipoRutinaActual === 'plan' || rutina.tipo_rutina === 'plan') && (
          <div className="rutina-info-metadata-item">
            <label className="rutina-info-label">Categoría:</label>
            {modoEdicion && editando ? (
              <select
                value={categoriaActual || ''}
                onChange={(e) => onEditarCampo('categoria', e.target.value)}
                className="rutina-info-select"
              >
                <option value="">Seleccione...</option>
                <option value="Basic">Basic</option>
                <option value="Medium">Medium</option>
                <option value="Premium">Premium</option>
              </select>
            ) : (
              <p className="rutina-info-text">
                {rutina.categoria || 'Sin plan'}
              </p>
            )}
          </div>
        )}

        {/* Cliente (solo para tipo cliente) */}
        {(tipoRutinaActual === 'cliente' || rutina.tipo_rutina === 'cliente') && (
          <div className="rutina-info-metadata-item">
            <label className="rutina-info-label">Cliente:</label>
            {modoEdicion && editando ? (
              <select
                value={usuarioActualId || ''}
                onChange={(e) => onEditarCampo('id_usuario', e.target.value ? parseInt(e.target.value) : null)}
                className="rutina-info-select rutina-info-select-cliente"
              >
                <option value="">Seleccione un cliente...</option>
                {usuarios.map(usuario => (
                  <option key={usuario.id_usuario} value={usuario.id_usuario}>
                    {usuario.nombre} {usuario.apellido} ({usuario.email})
                  </option>
                ))}
              </select>
            ) : (
              <p className="rutina-info-text">
                {rutina.usuario ? `${rutina.usuario.nombre} ${rutina.usuario.apellido}` : 'Sin cliente'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Indicador si requiere nueva rutina */}
      {modoEdicion && editando && requiereNuevaRutina && (
        <div className="rutina-info-warning">
          ⚠️ Los cambios realizados requieren crear una nueva rutina. Usa el botón "Guardar como Nueva Rutina".
        </div>
      )}
    </div>
  );
};

export default RutinaInfoHeader;

