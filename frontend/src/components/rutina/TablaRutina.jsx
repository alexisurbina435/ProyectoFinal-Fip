import React, { useState, useEffect, useMemo } from "react";
import "./TablaRutina.css";
import usuarioService from "../../services/usuario.service";
import rutinaService from "../../services/rutina.service";
import dificultadService from "../../services/dificultad.service";

export default function TablaRutina({ rutinaProp = null, modoEdicion = false, onRutinaActualizada = null }) {
  const [rutina, setRutina] = useState(rutinaProp);
  const [loading, setLoading] = useState(!rutinaProp);
  const [error, setError] = useState(null);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState([]);
  const [editando, setEditando] = useState(false);
  const [datosEditados, setDatosEditados] = useState({});

  // Si se pasa rutina como prop, actualizar estado
  useEffect(() => {
    if (rutinaProp) {
      setRutina(rutinaProp);
      setLoading(false);
      
      // Establecer valores por defecto
      if (rutinaProp.semanas && rutinaProp.semanas.length > 0) {
        const primeraSemana = rutinaProp.semanas[0];
        setSemanaSeleccionada(primeraSemana.id_semana);
        
        if (primeraSemana.dias && primeraSemana.dias.length > 0) {
          setDiaSeleccionado(primeraSemana.dias[0].id_dia);
        }
      }
    }
  }, [rutinaProp]);

  // Cargar rutina activa del usuario (solo si no se pasa como prop)
  useEffect(() => {
    if (rutinaProp) return; // Si se pasa como prop, no cargar

    const cargarRutinaActiva = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener usuario actual
        const usuario = await usuarioService.getUsuarioById();
        
        // Verificar si tiene rutina activa
        let rutinaActivaId = null;
        if (usuario.rutina_activa) {
          rutinaActivaId = usuario.rutina_activa.id_rutina || usuario.rutina_activa;
        } else if (usuario.rutina_activa_id) {
          rutinaActivaId = usuario.rutina_activa_id;
        }

        if (!rutinaActivaId) {
          setError("No tienes una rutina activa asignada");
          setLoading(false);
          return;
        }

        // Obtener rutina completa con todas las relaciones
        const rutinaCompleta = await rutinaService.getRutinaById(rutinaActivaId);
        setRutina(rutinaCompleta);

        // Establecer valores por defecto: primera semana y primer día
        if (rutinaCompleta.semanas && rutinaCompleta.semanas.length > 0) {
          const primeraSemana = rutinaCompleta.semanas[0];
          setSemanaSeleccionada(primeraSemana.id_semana);
          
          if (primeraSemana.dias && primeraSemana.dias.length > 0) {
            setDiaSeleccionado(primeraSemana.dias[0].id_dia);
          }
        }
      } catch (err) {
        console.error("Error al cargar rutina:", err);
        setError("Error al cargar la rutina. Por favor, intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    cargarRutinaActiva();
  }, [rutinaProp]);

  // Filtrar ejercicios según semana y día seleccionados
  useEffect(() => {
    if (!rutina || !semanaSeleccionada || !diaSeleccionado) {
      setEjerciciosFiltrados([]);
      return;
    }

    // Buscar la semana seleccionada
    const semana = rutina.semanas?.find(s => s.id_semana === semanaSeleccionada);
    if (!semana || !semana.dias) {
      setEjerciciosFiltrados([]);
      return;
    }

    // Buscar el día seleccionado
    const dia = semana.dias.find(d => d.id_dia === diaSeleccionado);
    if (!dia || !dia.dificultades) {
      setEjerciciosFiltrados([]);
      return;
    }

    // Extraer ejercicios de las dificultades
    const ejercicios = dia.dificultades.map(dificultad => ({
      id: dificultad.id_dificultad,
      nombre: dificultad.ejercicio?.nombre || 'Ejercicio sin nombre',
      series: dificultad.series || 0,
      repeticiones: dificultad.repeticiones || 0,
      peso: dificultad.peso || 0,
      img_url: dificultad.ejercicio?.img_url || null,
      video_url: dificultad.ejercicio?.video_url || null,
    }));

    setEjerciciosFiltrados(ejercicios);
  }, [rutina, semanaSeleccionada, diaSeleccionado]);

  // Obtener semanas disponibles
  const semanasDisponibles = useMemo(() => {
    if (!rutina || !rutina.semanas) return [];
    return rutina.semanas.sort((a, b) => a.numero_semana - b.numero_semana);
  }, [rutina]);

  // Obtener días disponibles para la semana seleccionada
  const diasDisponibles = useMemo(() => {
    if (!rutina || !semanaSeleccionada) return [];
    const semana = rutina.semanas?.find(s => s.id_semana === semanaSeleccionada);
    if (!semana || !semana.dias) return [];
    return semana.dias.sort((a, b) => a.numero_dia - b.numero_dia);
  }, [rutina, semanaSeleccionada]);

  // Actualizar día seleccionado cuando cambia la semana
  useEffect(() => {
    if (diasDisponibles.length > 0 && !diasDisponibles.find(d => d.id_dia === diaSeleccionado)) {
      setDiaSeleccionado(diasDisponibles[0].id_dia);
    }
  }, [semanaSeleccionada, diasDisponibles]);

  // Manejar cambio de semana
  const handleSemanaChange = (e) => {
    const nuevaSemanaId = parseInt(e.target.value);
    setSemanaSeleccionada(nuevaSemanaId);
  };

  // Manejar cambio de día
  const handleDiaChange = (e) => {
    const nuevoDiaId = parseInt(e.target.value);
    setDiaSeleccionado(nuevoDiaId);
  };

  // Manejar click en imagen
  const handleVerImagen = (imgUrl) => {
    if (imgUrl) {
      window.open(imgUrl, '_blank');
    } else {
      alert('No hay imagen disponible para este ejercicio');
    }
  };

  // Manejar click en video
  const handleVerVideo = (videoUrl) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    } else {
      alert('No hay video disponible para este ejercicio');
    }
  };

  // Manejar edición de campos de la rutina
  const handleEditarCampo = (campo, valor) => {
    setDatosEditados(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Guardar cambios de la rutina
  const handleGuardarCambios = async () => {
    if (!rutina || Object.keys(datosEditados).length === 0) return;

    try {
      const rutinaActualizada = await rutinaService.updateRutina(rutina.id_rutina, datosEditados);
      
      // Recargar rutina completa
      const rutinaCompleta = await rutinaService.getRutinaById(rutina.id_rutina);
      setRutina(rutinaCompleta);
      setDatosEditados({});
      setEditando(false);
      
      if (onRutinaActualizada) {
        onRutinaActualizada(rutinaCompleta);
      }
      
      alert('Rutina actualizada exitosamente');
    } catch (err) {
      console.error("Error al actualizar rutina:", err);
      alert('Error al actualizar la rutina. Por favor, intenta nuevamente.');
    }
  };

  // Manejar edición de dificultad (series, repeticiones, peso)
  const handleEditarDificultad = async (dificultadId, campo, valor) => {
    try {
      const updateData = { [campo]: valor };
      await dificultadService.updateDificultad(dificultadId, updateData);
      
      // Recargar la rutina para reflejar los cambios
      if (rutina && rutina.id_rutina) {
        const rutinaActualizada = await rutinaService.getRutinaById(rutina.id_rutina);
        setRutina(rutinaActualizada);
        
        if (onRutinaActualizada) {
          onRutinaActualizada(rutinaActualizada);
        }
      }
    } catch (err) {
      console.error("Error al actualizar dificultad:", err);
      alert(`Error al actualizar ${campo}. Por favor, intenta nuevamente.`);
    }
  };

  if (loading) {
    return (
      <div className="tabla-contenedor">
        <p style={{ color: '#f5f5f5', textAlign: 'center' }}>Cargando rutina...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tabla-contenedor">
        <p style={{ color: '#ff6a00', textAlign: 'center' }}>{error}</p>
      </div>
    );
  }

  if (!rutina) {
    return (
      <div className="tabla-contenedor">
        <p style={{ color: '#f5f5f5', textAlign: 'center' }}>No se encontró la rutina activa</p>
      </div>
    );
  }

  return (
    <div className="tabla-contenedor">
      <div className="tabla-header">
        <div>
          {modoEdicion && editando ? (
            <>
              <input
                type="text"
                value={datosEditados.nombre !== undefined ? datosEditados.nombre : rutina.nombre}
                onChange={(e) => handleEditarCampo('nombre', e.target.value)}
                style={{
                  background: '#2a2a2a',
                  border: '1px solid #ff6a00',
                  color: '#fff',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  width: '100%',
                  maxWidth: '400px'
                }}
                placeholder="Nombre de la rutina"
              />
              <textarea
                value={datosEditados.descripcion !== undefined ? datosEditados.descripcion : rutina.descripcion}
                onChange={(e) => handleEditarCampo('descripcion', e.target.value)}
                style={{
                  background: '#2a2a2a',
                  border: '1px solid #ff6a00',
                  color: '#ccc',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  marginTop: '8px',
                  width: '100%',
                  maxWidth: '400px',
                  minHeight: '60px',
                  resize: 'vertical'
                }}
                placeholder="Descripción de la rutina"
              />
            </>
          ) : (
            <>
              <h2>{rutina.nombre || 'MI RUTINA'}</h2>
              {rutina.descripcion && (
                <p style={{ 
                  color: '#ccc', 
                  fontSize: '0.9rem', 
                  marginTop: '8px',
                  fontStyle: 'italic'
                }}>
                  {rutina.descripcion}
                </p>
              )}
            </>
          )}
          {modoEdicion && (
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              {!editando ? (
                <button
                  onClick={() => setEditando(true)}
                  style={{
                    background: '#ff6a00',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  Editar Rutina
                </button>
              ) : (
                <>
                  <button
                    onClick={handleGuardarCambios}
                    disabled={Object.keys(datosEditados).length === 0}
                    style={{
                      background: Object.keys(datosEditados).length > 0 ? '#28a745' : '#666',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: Object.keys(datosEditados).length > 0 ? 'pointer' : 'not-allowed',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setEditando(false);
                      setDatosEditados({});
                    }}
                    style={{
                      background: '#6c757d',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="tabla-opciones">
          <select
            value={semanaSeleccionada || ''}
            onChange={handleSemanaChange}
            disabled={semanasDisponibles.length === 0}
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

          <select
            value={diaSeleccionado || ''}
            onChange={handleDiaChange}
            disabled={diasDisponibles.length === 0}
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
        </div>
      </div>

      <table className="tabla-rutina">
        <thead>
          <tr>
            <th>EJERCICIO</th>
            <th>SERIES</th>
            <th>REP</th>
            <th>PESO (kg)</th>
            <th>Img. Ej.</th>
            <th>Vid. Ej.</th>
          </tr>
        </thead>
        <tbody>
          {ejerciciosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', color: '#999' }}>
                {semanaSeleccionada && diaSeleccionado 
                  ? 'No hay ejercicios para este día' 
                  : 'Selecciona una semana y un día'}
              </td>
            </tr>
          ) : (
            ejerciciosFiltrados.map((ejercicio) => (
              <tr key={ejercicio.id}>
                <td>{ejercicio.nombre}</td>
                <td>
                  {modoEdicion && editando ? (
                    <input
                      type="number"
                      min="0"
                      value={ejercicio.series}
                      onChange={(e) => handleEditarDificultad(ejercicio.id, 'series', parseInt(e.target.value))}
                      style={{
                        width: '60px',
                        background: '#2a2a2a',
                        border: '1px solid #ff6a00',
                        color: '#fff',
                        padding: '4px',
                        borderRadius: '4px',
                        textAlign: 'center'
                      }}
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
                      onChange={(e) => handleEditarDificultad(ejercicio.id, 'repeticiones', parseInt(e.target.value))}
                      style={{
                        width: '60px',
                        background: '#2a2a2a',
                        border: '1px solid #ff6a00',
                        color: '#fff',
                        padding: '4px',
                        borderRadius: '4px',
                        textAlign: 'center'
                      }}
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
                      onChange={(e) => handleEditarDificultad(ejercicio.id, 'peso', parseInt(e.target.value))}
                      style={{
                        width: '60px',
                        background: '#2a2a2a',
                        border: '1px solid #ff6a00',
                        color: '#fff',
                        padding: '4px',
                        borderRadius: '4px',
                        textAlign: 'center'
                      }}
                    />
                  ) : (
                    ejercicio.peso > 0 ? ejercicio.peso : '-'
                  )}
                </td>
                <td 
                  className={ejercicio.img_url ? "link" : ""}
                  onClick={() => handleVerImagen(ejercicio.img_url)}
                  style={{ 
                    cursor: ejercicio.img_url ? 'pointer' : 'default',
                    color: ejercicio.img_url ? '#ff6a00' : '#666'
                  }}
                >
                  {ejercicio.img_url ? 'Ver Imagen' : 'N/A'}
                </td>
                <td 
                  className={ejercicio.video_url ? "link" : ""}
                  onClick={() => handleVerVideo(ejercicio.video_url)}
                  style={{ 
                    cursor: ejercicio.video_url ? 'pointer' : 'default',
                    color: ejercicio.video_url ? '#ff6a00' : '#666'
                  }}
                >
                  {ejercicio.video_url ? 'Ver Video' : 'N/A'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
