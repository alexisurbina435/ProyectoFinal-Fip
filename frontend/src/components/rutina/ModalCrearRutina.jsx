import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import rutinaService from "../../services/rutina.service";
import ejercicioService from "../../services/ejercicio.service";
import usuarioService from "../../services/usuario.service";
import "./ModalCrearRutina.css";

const ModalCrearRutina = ({ isOpen, onClose, onRutinaCreada, initialUsuarioId = null }) => {
  const [step, setStep] = useState(1); // 1: Info básica, 2: Semanas/Días, 3: Ejercicios
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Datos básicos de la rutina
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nivel, setNivel] = useState("principiante");
  const [tipoRutina, setTipoRutina] = useState("cliente"); // "cliente", "general", "plan"
  const [idUsuario, setIdUsuario] = useState(initialUsuarioId);
  const [categoria, setCategoria] = useState(null);
  
  // Listas para selección
  const [usuarios, setUsuarios] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  
  // Estructura de semanas/días/ejercicios
  const [semanas, setSemanas] = useState([
    { numero_semana: 1, dias: [{ numero_dia: 1, ejercicios: [] }] }
  ]);
  
  // Estado para crear nuevo ejercicio
  const [mostrarFormEjercicio, setMostrarFormEjercicio] = useState(false);
  const [nuevoEjercicio, setNuevoEjercicio] = useState({
    nombre: "",
    detalle: "",
    tipo: "",
    grupo_muscular: "",
    img_url: "",
    video_url: ""
  });

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      cargarDatosIniciales();
      // Si hay un usuario inicial, establecerlo
      if (initialUsuarioId) {
        setIdUsuario(initialUsuarioId);
        setTipoRutina("cliente");
      }
    } else {
      // Resetear formulario al cerrar
      resetearFormulario();
    }
  }, [isOpen, initialUsuarioId]);

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

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      const [usuariosData, ejerciciosData] = await Promise.all([
        usuarioService.getAllUsuarios(),
        ejercicioService.getAllEjercicios()
      ]);
      setUsuarios(usuariosData);
      setEjercicios(ejerciciosData);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("Error al cargar usuarios o ejercicios");
    } finally {
      setLoading(false);
    }
  };

  const resetearFormulario = () => {
    setStep(1);
    setNombre("");
    setDescripcion("");
    setNivel("principiante");
    setTipoRutina("cliente");
    setIdUsuario(initialUsuarioId || null);
    setCategoria(null);
    setSemanas([{ numero_semana: 1, dias: [{ numero_dia: 1, ejercicios: [] }] }]);
    setError(null);
    setMostrarFormEjercicio(false);
  };

  // Manejar tipo de rutina
  const handleTipoRutinaChange = (tipo) => {
    // Si hay un usuario inicial, no permitir cambiar el tipo de rutina
    if (initialUsuarioId) {
      return;
    }
    setTipoRutina(tipo);
    if (tipo === "general") {
      // Para rutinas generales, usar el primer usuario o un usuario sistema
      // NOTA: Esto requiere que exista un usuario "sistema" o usar el admin
      setIdUsuario(usuarios.length > 0 ? usuarios[0].id_usuario : null);
      setCategoria(null);
    } else if (tipo === "plan") {
      setIdUsuario(usuarios.length > 0 ? usuarios[0].id_usuario : null);
    } else {
      setIdUsuario(null);
      setCategoria(null);
    }
  };

  // Función helper para reordenar números de semanas y días automáticamente
  const reordenarNumeros = (semanasArray) => {
    return semanasArray.map((semana, semanaIndex) => ({
      ...semana,
      numero_semana: semanaIndex + 1,
      dias: semana.dias.map((dia, diaIndex) => ({
        ...dia,
        numero_dia: diaIndex + 1
      }))
    }));
  };

  // Agregar semana (los números se asignan automáticamente)
  const agregarSemana = () => {
    const nuevasSemanas = [...semanas, { 
      numero_semana: semanas.length + 1, 
      dias: [{ numero_dia: 1, ejercicios: [] }] 
    }];
    setSemanas(reordenarNumeros(nuevasSemanas));
  };

  // Eliminar semana (los números se reordenan automáticamente)
  const eliminarSemana = (index) => {
    if (semanas.length > 1) {
      const nuevasSemanas = semanas.filter((_, i) => i !== index);
      setSemanas(reordenarNumeros(nuevasSemanas));
    }
  };

  // Agregar día a una semana (el número se asigna automáticamente)
  const agregarDia = (semanaIndex) => {
    const nuevasSemanas = [...semanas];
    nuevasSemanas[semanaIndex].dias.push({ 
      numero_dia: nuevasSemanas[semanaIndex].dias.length + 1, 
      ejercicios: [] 
    });
    setSemanas(reordenarNumeros(nuevasSemanas));
  };

  // Eliminar día de una semana (los números se reordenan automáticamente)
  const eliminarDia = (semanaIndex, diaIndex) => {
    const nuevasSemanas = [...semanas];
    if (nuevasSemanas[semanaIndex].dias.length > 1) {
      nuevasSemanas[semanaIndex].dias = nuevasSemanas[semanaIndex].dias.filter(
        (_, i) => i !== diaIndex
      );
      setSemanas(reordenarNumeros(nuevasSemanas));
    }
  };

  // Agregar ejercicio a un día
  const agregarEjercicioADia = (semanaIndex, diaIndex, ejercicioId) => {
    const nuevasSemanas = [...semanas];
    const ejercicio = ejercicios.find(e => e.id_ejercicio === ejercicioId);
    if (ejercicio) {
      nuevasSemanas[semanaIndex].dias[diaIndex].ejercicios.push({
        id_ejercicio: ejercicioId,
        nombre: ejercicio.nombre,
        series: 3,
        repeticiones: 10,
        peso: 0
      });
      setSemanas(nuevasSemanas);
    }
  };

  // Eliminar ejercicio de un día
  const eliminarEjercicioDeDia = (semanaIndex, diaIndex, ejercicioIndex) => {
    const nuevasSemanas = [...semanas];
    nuevasSemanas[semanaIndex].dias[diaIndex].ejercicios.splice(ejercicioIndex, 1);
    setSemanas(nuevasSemanas);
  };

  // Actualizar datos de ejercicio en un día
  const actualizarEjercicioEnDia = (semanaIndex, diaIndex, ejercicioIndex, campo, valor) => {
    const nuevasSemanas = [...semanas];
    nuevasSemanas[semanaIndex].dias[diaIndex].ejercicios[ejercicioIndex][campo] = valor;
    setSemanas(nuevasSemanas);
  };

  // Crear nuevo ejercicio
  const crearNuevoEjercicio = async () => {
    try {
      if (!nuevoEjercicio.nombre || !nuevoEjercicio.detalle) {
        setError("Nombre y detalle son requeridos para el ejercicio");
        return;
      }

      const ejercicioCreado = await ejercicioService.createEjercicio(nuevoEjercicio);
      setEjercicios([...ejercicios, ejercicioCreado]);
      setNuevoEjercicio({
        nombre: "",
        detalle: "",
        tipo: "",
        grupo_muscular: "",
        img_url: "",
        video_url: ""
      });
      setMostrarFormEjercicio(false);
    } catch (err) {
      console.error("Error al crear ejercicio:", err);
      setError("Error al crear el ejercicio");
    }
  };

  // Validar formulario
  const validarFormulario = () => {
    if (!nombre.trim()) {
      setError("El nombre de la rutina es requerido");
      return false;
    }
    if (!descripcion.trim()) {
      setError("La descripción es requerida");
      return false;
    }
    if (tipoRutina === "cliente" && !idUsuario) {
      setError("Debes seleccionar un cliente");
      return false;
    }
    if (tipoRutina === "plan" && !categoria) {
      setError("Debes seleccionar una categoría de plan");
      return false;
    }
    if (semanas.length === 0) {
      setError("Debes agregar al menos una semana");
      return false;
    }
    // Validar que todas las semanas tengan al menos un día
    if (semanas.some(s => s.dias.length === 0)) {
      setError("Cada semana debe tener al menos un día");
      return false;
    }
    // Validar que todos los días tengan al menos un ejercicio
    if (semanas.some(s => s.dias.some(d => d.ejercicios.length === 0))) {
      setError("Cada día debe tener al menos un ejercicio");
      return false;
    }
    return true;
  };

  // Crear rutina completa usando el nuevo endpoint
  const crearRutina = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Preparar datos para el endpoint de rutina completa
      const rutinaCompletaData = {
        nombre,
        descripcion,
        nivel,
        tipo_rutina: tipoRutina,
        categoria: tipoRutina === "plan" ? categoria : undefined,
        id_usuario: tipoRutina === "cliente" ? idUsuario : undefined,
        semanas: semanas.map(semana => ({
          numero_semana: semana.numero_semana,
          dias: semana.dias.map(dia => ({
            numero_dia: dia.numero_dia,
            ejercicios: dia.ejercicios.map(ej => ({
              ejercicioId: ej.id_ejercicio,
              series: ej.series,
              repeticiones: ej.repeticiones,
              peso: ej.peso || 0
            }))
          }))
        }))
      };

      // Usar el nuevo endpoint que crea todo en una transacción
      const rutinaCompleta = await rutinaService.createRutinaCompleta(rutinaCompletaData);
      
      if (onRutinaCreada) {
        onRutinaCreada(rutinaCompleta);
      }

      resetearFormulario();
      onClose();
    } catch (err) {
      console.error("Error al crear rutina:", err);
      setError(err.response?.data?.message || err.message || "Error al crear la rutina. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-crear-rutina" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crear Nueva Rutina</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && (
          <div className="error-message" style={{ 
            padding: '10px', 
            margin: '10px 0', 
            backgroundColor: '#fee', 
            color: '#c33', 
            borderRadius: '4px' 
          }}>
            {error}
          </div>
        )}

        {/* Paso 1: Información básica */}
        {step === 1 && (
          <div className="modal-step">
            <h3>Información Básica</h3>
            
            <div className="form-group">
              <label>Nombre de la rutina *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Rutina Principiante Semana 1-4"
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe la rutina..."
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Nivel *</label>
              <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tipo de Rutina *</label>
              <select 
                value={tipoRutina} 
                onChange={(e) => handleTipoRutinaChange(e.target.value)}
                disabled={!!initialUsuarioId}
              >
                <option value="cliente">Para Cliente Específico</option>
                <option value="general">Rutina General (Uso General)</option>
                <option value="plan">Rutina Ligada a Plan</option>
              </select>
              {initialUsuarioId && (
                <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '5px', fontStyle: 'italic' }}>
                  El tipo de rutina está fijado en "Para Cliente Específico" porque se está creando desde el panel de edición de cliente
                </p>
              )}
            </div>

            {tipoRutina === "cliente" && (
              <div className="form-group">
                <label>Cliente *</label>
                <select 
                  value={idUsuario || ""} 
                  onChange={(e) => setIdUsuario(parseInt(e.target.value))}
                  disabled={!!initialUsuarioId}
                >
                  <option value="">Selecciona un cliente</option>
                  {usuarios.map(usuario => {
                    const planUsuario = obtenerPlanUsuario(usuario);
                    return (
                      <option key={usuario.id_usuario} value={usuario.id_usuario}>
                        {usuario.nombre} {usuario.apellido} - {planUsuario}
                      </option>
                    );
                  })}
                </select>
                {initialUsuarioId && (
                  <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                    La rutina se asignará automáticamente al cliente que estás editando
                  </p>
                )}
              </div>
            )}

            {tipoRutina === "plan" && (
              <div className="form-group">
                <label>Categoría de Plan *</label>
                <select 
                  value={categoria || ""} 
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="Basic">Basic</option>
                  <option value="Medium">Medium</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            )}

            {tipoRutina === "general" && (
              <div className="info-box" style={{
                padding: '10px',
                backgroundColor: '#e3f2fd',
                borderRadius: '4px',
                marginTop: '10px',
                fontSize: '0.9rem',
                color: '#1976d2'
              }}>
                <strong>Nota:</strong> Las rutinas generales no se asignarán a ningún cliente específico. 
                Pueden ser utilizadas como plantillas para futuros clientes o como rutinas predeterminadas por nivel.
              </div>
            )}

            <div className="modal-actions">
              <button onClick={onClose} className="btn-cancel">Cancelar</button>
              <button onClick={() => setStep(2)} className="btn-next" disabled={!nombre || !descripcion}>
                Siguiente: Semanas y Días
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Semanas y Días */}
        {step === 2 && (
          <div className="modal-step">
            <h3>Semanas y Días</h3>
            
            {semanas.map((semana, semanaIndex) => (
              <div key={semanaIndex} className="semana-container" style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4>Semana {semana.numero_semana}</h4>
                  {semanas.length > 1 && (
                    <button 
                      onClick={() => eliminarSemana(semanaIndex)}
                      style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                {semana.dias.map((dia, diaIndex) => (
                  <div key={diaIndex} className="dia-container" style={{
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    padding: '10px',
                    marginBottom: '10px',
                    backgroundColor: 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>Día {dia.numero_dia}</strong>
                      {semana.dias.length > 1 && (
                        <button 
                          onClick={() => eliminarDia(semanaIndex, diaIndex)}
                          style={{ background: '#dc3545', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                      {dia.ejercicios.length} ejercicio(s) asignado(s)
                    </p>
                  </div>
                ))}

                <button 
                  onClick={() => agregarDia(semanaIndex)}
                  style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginTop: '5px' }}
                >
                  + Agregar Día
                </button>
              </div>
            ))}

            <button 
              onClick={agregarSemana}
              style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', marginBottom: '15px' }}
            >
              + Agregar Semana
            </button>

            <div className="modal-actions">
              <button onClick={() => setStep(1)} className="btn-back">Atrás</button>
              <button onClick={() => setStep(3)} className="btn-next">
                Siguiente: Asignar Ejercicios
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Asignar Ejercicios */}
        {step === 3 && (
          <div className="modal-step">
            <h3>Asignar Ejercicios</h3>

            {/* Botón para crear nuevo ejercicio */}
            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={() => setMostrarFormEjercicio(!mostrarFormEjercicio)}
                style={{ 
                  background: '#17a2b8', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 15px', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                {mostrarFormEjercicio ? 'Cancelar' : '+ Crear Nuevo Ejercicio'}
              </button>
            </div>

            {/* Formulario para crear ejercicio */}
            {mostrarFormEjercicio && (
              <div className="form-crear-ejercicio" style={{
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                backgroundColor: '#ffffffff'
              }}>
                <h4>Nuevo Ejercicio</h4>
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={nuevoEjercicio.nombre}
                    onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, nombre: e.target.value})}
                    placeholder="Ej: Sentadillas"
                  />
                </div>
                <div className="form-group">
                  <label>Detalle *</label>
                  <textarea
                    value={nuevoEjercicio.detalle}
                    onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, detalle: e.target.value})}
                    placeholder="Descripción del ejercicio"
                    rows="2"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label>Tipo</label>
                    <input
                      type="text"
                      value={nuevoEjercicio.tipo}
                      onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, tipo: e.target.value})}
                      placeholder="Ej: fuerza, cardio"
                    />
                  </div>
                  <div className="form-group">
                    <label>Grupo Muscular</label>
                    <input
                      type="text"
                      value={nuevoEjercicio.grupo_muscular}
                      onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, grupo_muscular: e.target.value})}
                      placeholder="Ej: piernas, pecho"
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label>URL Imagen</label>
                    <input
                      type="text"
                      value={nuevoEjercicio.img_url}
                      onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, img_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="form-group">
                    <label>URL Video</label>
                    <input
                      type="text"
                      value={nuevoEjercicio.video_url}
                      onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, video_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <button 
                  onClick={crearNuevoEjercicio}
                  style={{ 
                    background: '#28a745', 
                    color: 'white', 
                    border: 'none', 
                    padding: '8px 15px', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                  }}
                >
                  Crear Ejercicio
                </button>
              </div>
            )}

            {/* Lista de semanas con días y ejercicios */}
            {semanas.map((semana, semanaIndex) => (
              <div key={semanaIndex} className="semana-ejercicios" style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                backgroundColor: '#f9f9f9'
              }}>
                <h4>Semana {semana.numero_semana}</h4>
                
                {semana.dias.map((dia, diaIndex) => (
                  <div key={diaIndex} className="dia-ejercicios" style={{
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    padding: '10px',
                    marginBottom: '10px',
                    backgroundColor: 'white'
                  }}>
                    <strong>Día {dia.numero_dia}</strong>
                    
                    {/* Selector de ejercicio */}
                    <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            agregarEjercicioADia(semanaIndex, diaIndex, parseInt(e.target.value));
                            e.target.value = "";
                          }
                        }}
                        style={{ width: '100%', padding: '5px' }}
                      >
                        <option value="">Seleccionar ejercicio para agregar...</option>
                        {ejercicios.map(ej => (
                          <option key={ej.id_ejercicio} value={ej.id_ejercicio}>
                            {ej.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Lista de ejercicios del día */}
                    {dia.ejercicios.map((ejercicio, ejercicioIndex) => (
                      <div key={ejercicioIndex} className="ejercicio-item" style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                        gap: '10px',
                        alignItems: 'center',
                        padding: '8px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        marginBottom: '5px'
                      }}>
                        <span><strong>{ejercicio.nombre}</strong></span>
                        <div>
                          <label style={{ fontSize: '0.8rem' }}>Series</label>
                          <input
                            type="number"
                            min="1"
                            value={ejercicio.series}
                            onChange={(e) => actualizarEjercicioEnDia(semanaIndex, diaIndex, ejercicioIndex, 'series', parseInt(e.target.value))}
                            style={{ width: '100%', padding: '3px' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem' }}>Repeticiones</label>
                          <input
                            type="number"
                            min="1"
                            value={ejercicio.repeticiones}
                            onChange={(e) => actualizarEjercicioEnDia(semanaIndex, diaIndex, ejercicioIndex, 'repeticiones', parseInt(e.target.value))}
                            style={{ width: '100%', padding: '3px' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem' }}>Peso (kg)</label>
                          <input
                            type="number"
                            min="0"
                            value={ejercicio.peso}
                            onChange={(e) => actualizarEjercicioEnDia(semanaIndex, diaIndex, ejercicioIndex, 'peso', parseInt(e.target.value))}
                            style={{ width: '100%', padding: '3px' }}
                          />
                        </div>
                        <button
                          onClick={() => eliminarEjercicioDeDia(semanaIndex, diaIndex, ejercicioIndex)}
                          style={{ 
                            background: '#dc3545', 
                            color: 'white', 
                            border: 'none', 
                            padding: '5px 10px', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            <div className="modal-actions">
              <button onClick={() => setStep(2)} className="btn-back">Atrás</button>
              <button 
                onClick={crearRutina} 
                className="btn-save" 
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Rutina'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ModalCrearRutina;

