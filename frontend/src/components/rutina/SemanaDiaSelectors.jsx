import React, { useState, useEffect } from 'react';
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
  // Estados locales para manejar el valor del select temporalmente
  const [semanaSelectValue, setSemanaSelectValue] = useState(semanaSeleccionada || '');
  const [diaSelectValue, setDiaSelectValue] = useState(diaSeleccionado || '');

  // Sincronizar los valores cuando cambian las props
  useEffect(() => {
    setSemanaSelectValue(semanaSeleccionada || '');
  }, [semanaSeleccionada]);

  useEffect(() => {
    setDiaSelectValue(diaSeleccionado || '');
  }, [diaSeleccionado]);
  return (
    <div className="tabla-header">
      <div style={{ flex: 1 }}></div>
      <div className="tabla-opciones">
        {/* Selector de Semana */}
        <div className="selector-group">
          <select
            value={semanaSelectValue}
            onChange={(e) => {
              if (e.target.value === 'add_semana') {
                const valorAnterior = semanaSeleccionada || '';
                setSemanaSelectValue(valorAnterior); // Restaurar inmediatamente
                onAgregarSemana();
              } else {
                setSemanaSelectValue(e.target.value);
                onSemanaChange(e);
              }
            }}
            disabled={semanasDisponibles.length === 0 && !(modoEdicion && editando)}
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
            {modoEdicion && editando && (
              <option value="add_semana" style={{ backgroundColor: '#28a745', color: '#fff', fontWeight: 'bold' }}>
                + Agregar Semana
              </option>
            )}
          </select>
          {modoEdicion && editando && semanaSeleccionada && semanasDisponibles.length > 1 && (
            <button
              onClick={() => onEliminarSemana(semanaSeleccionada)}
              className="selector-btn selector-btn-delete"
              title="Eliminar semana"
            >
              ×
            </button>
          )}
        </div>

        {/* Selector de Día */}
        <div className="selector-group">
          <select
            value={diaSelectValue}
            onChange={(e) => {
              if (e.target.value === 'add_dia') {
                const valorAnterior = diaSeleccionado || '';
                setDiaSelectValue(valorAnterior); // Restaurar inmediatamente
                onAgregarDia();
              } else {
                setDiaSelectValue(e.target.value);
                onDiaChange(e);
              }
            }}
            disabled={diasDisponibles.length === 0 && !(modoEdicion && editando && semanaSeleccionada)}
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
            {modoEdicion && editando && semanaSeleccionada && (
              <option value="add_dia" style={{ backgroundColor: '#28a745', color: '#fff', fontWeight: 'bold' }}>
                + Agregar Día
              </option>
            )}
          </select>
          {modoEdicion && editando && semanaSeleccionada && diaSeleccionado && diasDisponibles.length > 1 && (
            <button
              onClick={() => onEliminarDia(diaSeleccionado)}
              className="selector-btn selector-btn-delete"
              title="Eliminar día"
            >
              ×
            </button>
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

