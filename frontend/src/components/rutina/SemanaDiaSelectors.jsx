import React from 'react';
import './SemanaDiaSelectors.css';

const SemanaDiaSelectors = ({
  semanasDisponibles,
  diasDisponibles,
  semanaSeleccionada,
  diaSeleccionado,
  modoEdicion,
  editando,
  onSemanaChange,
  onDiaChange,
  onAgregarSemana,
  onEliminarSemana,
  onAgregarDia,
  onEliminarDia,
  onAgregarEjercicio
}) => {
  return (
    <div className="tabla-header">
      <div style={{ flex: 1 }}></div>
      <div className="tabla-opciones">
        {/* Selector de Semana */}
        <div className="selector-group">
          <select
            value={semanaSeleccionada || ''}
            onChange={onSemanaChange}
            disabled={semanasDisponibles.length === 0}
            className="selector-select"
          >
            {semanasDisponibles.length === 0 ? (
              <option value="">Sin semanas</option>
            ) : (
              semanasDisponibles.map((semana) => (
                <option key={semana.id_semana} value={semana.id_semana}>
                  SEMANA {semana.numero_semana}
                </option>
              ))
            )}
          </select>
          {modoEdicion && editando && (
            <>
              <button
                onClick={onAgregarSemana}
                className="selector-btn selector-btn-add"
                title="Agregar semana"
              >
                + Semana
              </button>
              {semanaSeleccionada && semanasDisponibles.length > 1 && (
                <button
                  onClick={() => onEliminarSemana(semanaSeleccionada)}
                  className="selector-btn selector-btn-delete"
                  title="Eliminar semana"
                >
                  ×
                </button>
              )}
            </>
          )}
        </div>

        {/* Selector de Día */}
        <div className="selector-group">
          <select
            value={diaSeleccionado || ''}
            onChange={onDiaChange}
            disabled={diasDisponibles.length === 0}
            className="selector-select"
          >
            {diasDisponibles.length === 0 ? (
              <option value="">Sin días</option>
            ) : (
              diasDisponibles.map((dia) => (
                <option key={dia.id_dia} value={dia.id_dia}>
                  DÍA {dia.numero_dia}
                </option>
              ))
            )}
          </select>
          {modoEdicion && editando && semanaSeleccionada && (
            <>
              <button
                onClick={onAgregarDia}
                className="selector-btn selector-btn-add"
                title="Agregar día"
              >
                + Día
              </button>
              {diaSeleccionado && diasDisponibles.length > 1 && (
                <button
                  onClick={() => onEliminarDia(diaSeleccionado)}
                  className="selector-btn selector-btn-delete"
                  title="Eliminar día"
                >
                  ×
                </button>
              )}
            </>
          )}
        </div>

        {/* Botón Agregar Ejercicio */}
        {modoEdicion && editando && (
          <button
            onClick={onAgregarEjercicio}
            className="selector-btn selector-btn-add-ejercicio"
          >
            + Agregar Ejercicio
          </button>
        )}
      </div>
    </div>
  );
};

export default SemanaDiaSelectors;

