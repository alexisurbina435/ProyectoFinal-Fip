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
  // NOTA: usuarioActualId ahora solo viene de datosEditados (no hay rutina.usuario)
  // Si se necesita obtener el usuario que tiene esta rutina activa, se debe hacer una consulta inversa
  const usuarioActualId = datosEditados.id_usuario !== undefined ? datosEditados.id_usuario : null;
  const nombreActual = datosEditados.nombre !== undefined ? datosEditados.nombre : rutina.nombre;
  const descripcionActual = datosEditados.descripcion !== undefined ? datosEditados.descripcion : rutina.descripcion;

  // Función helper para obtener el plan de un usuario
  const obtenerPlanUsuario = (usuario) => {
    if (!usuario?.suscripciones || !Array.isArray(usuario.suscripciones) || usuario.suscripciones.length === 0) {
      return 'Sin plan';
    }
    
    // Buscar suscripción activa o tomar la primera
    const suscripcionActiva = usuario.suscripciones.find(s => 
      s && s.estado && String(s.estado).toUpperCase() === 'ACTIVA'
    );
    const suscripcion = suscripcionActiva || usuario.suscripciones[0];
    
    // Verificar si la suscripción tiene plan
    if (suscripcion && suscripcion.plan && suscripcion.plan.nombre) {
      // Mapear valores del backend al formato del frontend
      const planNombre = String(suscripcion.plan.nombre).toLowerCase().trim();
      const planMapping = {
        'basic': 'Basic',
        'standard': 'Standard',
        'premium': 'Premium'
      };
      return planMapping[planNombre] || suscripcion.plan.nombre;
    }
    
    return 'Sin plan';
  };

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
                {usuarios.map(usuario => {
                  const planUsuario = obtenerPlanUsuario(usuario);
                  return (
                    <option key={usuario.id_usuario} value={usuario.id_usuario}>
                      {usuario.nombre} {usuario.apellido} - {planUsuario}
                    </option>
                  );
                })}
              </select>
            ) : (
              <p className="rutina-info-text">
                {/* NOTA: Para mostrar el cliente, se necesitaría una consulta inversa
                    para obtener usuarios que tienen esta rutina como activa.
                    Por ahora mostramos un mensaje genérico. */}
                {tipoRutinaActual === 'cliente' ? 'Cliente específico' : 'Sin cliente'}
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

