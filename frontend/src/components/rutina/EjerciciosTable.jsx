import React from 'react';
import './EjerciciosTable.css';

const EjerciciosTable = ({
  ejercicios,
  modoEdicion,
  editando,
  semanaSeleccionada,
  diaSeleccionado,
  onEditarDificultad,
  onEliminarEjercicio,
  onVerImagen,
  onVerVideo
}) => {
  return (
    <table className="tabla-rutina">
      <thead>
        <tr>
          <th>EJERCICIO</th>
          <th>SERIES</th>
          <th>REP</th>
          <th>PESO (kg)</th>
          <th>Img. Ej.</th>
          <th>Vid. Ej.</th>
          {modoEdicion && editando && <th>ACCIONES</th>}
        </tr>
      </thead>
      <tbody>
        {ejercicios.length === 0 ? (
          <tr>
            <td colSpan={modoEdicion && editando ? 7 : 6} className="tabla-empty">
              {semanaSeleccionada && diaSeleccionado 
                ? 'No hay ejercicios para este día' 
                : 'Selecciona una semana y un día'}
            </td>
          </tr>
        ) : (
          ejercicios.map((ejercicio) => (
            <tr key={ejercicio.id}>
              <td>{ejercicio.nombre}</td>
              <td>
                {modoEdicion && editando ? (
                  <input
                    type="number"
                    min="0"
                    value={ejercicio.series}
                    onChange={(e) => onEditarDificultad(ejercicio.id, 'series', parseInt(e.target.value))}
                    className="tabla-input-number"
                  />
                ) : (
                  ejercicio.series
                )}
              </td>
              <td>
                {modoEdicion && editando ? (
                  <input
                    type="number"
                    min="0"
                    value={ejercicio.repeticiones}
                    onChange={(e) => onEditarDificultad(ejercicio.id, 'repeticiones', parseInt(e.target.value))}
                    className="tabla-input-number"
                  />
                ) : (
                  ejercicio.repeticiones
                )}
              </td>
              <td>
                {modoEdicion && editando ? (
                  <input
                    type="number"
                    min="0"
                    value={ejercicio.peso}
                    onChange={(e) => onEditarDificultad(ejercicio.id, 'peso', parseInt(e.target.value))}
                    className="tabla-input-number"
                  />
                ) : (
                  ejercicio.peso > 0 ? ejercicio.peso : '-'
                )}
              </td>
              <td 
                className={ejercicio.img_url ? "link tabla-link" : "tabla-link-disabled"}
                onClick={() => onVerImagen(ejercicio.img_url)}
              >
                {ejercicio.img_url ? 'Ver Imagen' : 'N/A'}
              </td>
              <td 
                className={ejercicio.video_url ? "link tabla-link" : "tabla-link-disabled"}
                onClick={() => onVerVideo(ejercicio.video_url)}
              >
                {ejercicio.video_url ? 'Ver Video' : 'N/A'}
              </td>
              {modoEdicion && editando && (
                <td>
                  <button
                    onClick={() => onEliminarEjercicio(ejercicio.id)}
                    className="tabla-btn-eliminar"
                    title="Eliminar ejercicio"
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default EjerciciosTable;

