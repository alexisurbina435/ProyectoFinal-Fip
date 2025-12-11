import React, { useState, useEffect, useMemo, useRef } from "react";
import "./tablaRutina.css";
import usuarioService from "../../services/usuario.service";
import rutinaService from "../../services/rutina.service";
import dificultadService from "../../services/dificultad.service";
import ejercicioService from "../../services/ejercicio.service";
import semanaService from "../../services/semana.service";
import diaService from "../../services/dia.service";
import Swal from 'sweetalert2';

// Componentes
import RutinaInfoHeader from "./RutinaInfoHeader";
import RutinaActionButtons from "./RutinaActionButtons";
import SemanaDiaSelectors from "./SemanaDiaSelectors";
import EjerciciosTable from "./EjerciciosTable";
import ModalAgregarEjercicio from "./ModalAgregarEjercicio";

// Hooks
import { useRutinaEdit } from "./hooks/useRutinaEdit";
import { useSemanasDias } from "./hooks/useSemanasDias";

// Utilidades
import { getSwalInstance } from "./utils/swalConfig";
import { validarDatosRutina } from "./utils/rutinaHelpers";

export default function TablaRutina({ rutinaProp = null, modoEdicion = false, onRutinaActualizada = null, isModal = false, onClose = null, onEliminarRutina = null, usuarios: usuariosProp = null }) {
  const [rutina, setRutina] = useState(rutinaProp);
  const [rutinaOriginal, setRutinaOriginal] = useState(null);
  const [loading, setLoading] = useState(!rutinaProp);
  const [error, setError] = useState(null);
  const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState([]);
  const rutinaOriginalIdRef = useRef(null); // Para rastrear qué rutina tiene guardada en rutinaOriginal
  
  // Estados para agregar ejercicios
  const [mostrarModalAgregarEjercicio, setMostrarModalAgregarEjercicio] = useState(false);
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([]);
  const [crearNuevoEjercicio, setCrearNuevoEjercicio] = useState(false);
  const [nuevoEjercicio, setNuevoEjercicio] = useState({
    nombre: "",
    detalle: "",
    tipo: "",
    grupo_muscular: "",
    img_url: "",
    video_url: ""
  });
  
  // Estados para usuarios
  const [usuarios, setUsuarios] = useState([]);
  
  // Si se pasan usuarios como prop, usarlos; sino cargarlos
  useEffect(() => {
    if (usuariosProp && Array.isArray(usuariosProp)) {
      setUsuarios(usuariosProp);
    }
  }, [usuariosProp]);
  
  // Estado para rastrear cambios en dificultades (series, repeticiones, peso)
  const [dificultadesEditadas, setDificultadesEditadas] = useState(new Map()); // Map<dificultadId, {series, repeticiones, peso}>
  
  // Estados para rastrear elementos agregados durante la edición (para poder revertirlos al cancelar)
  const [semanasAgregadas, setSemanasAgregadas] = useState(new Set()); // Set<id_semana>
  const [diasAgregados, setDiasAgregados] = useState(new Set()); // Set<id_dia>
  const [ejerciciosAgregados, setEjerciciosAgregados] = useState(new Set()); // Set<id_dificultad>

  // Hooks personalizados
  const {
    datosEditados,
    editando,
    ejerciciosEliminados,
    requiereNuevaRutina,
    tieneCambios: tieneCambiosBase,
    handleEditarCampo,
    setEditando,
    setEjerciciosEliminados,
    resetEdit
  } = useRutinaEdit(rutina, rutinaOriginal);
  
  // Comparar estructuras de rutinas y detectar cambios en semanas/días/ejercicios
  const tieneCambiosEstructurales = useMemo(() => {
    if (!rutina || !rutinaOriginal) {
      return false;
    }
    
    // Comparar número de semanas
    const semanasOriginales = rutinaOriginal.semanas || [];
    const semanasActuales = rutina.semanas || [];
    
    if (semanasOriginales.length !== semanasActuales.length) {
      return true;
    }
    
    // Comparar IDs de semanas (para detectar agregaciones y eliminaciones)
    const idsSemanasOriginales = new Set(semanasOriginales.map(s => s.id_semana));
    const idsSemanasActuales = new Set(semanasActuales.map(s => s.id_semana));
    
    // Detectar semanas nuevas (agregadas)
    for (const id of idsSemanasActuales) {
      if (!idsSemanasOriginales.has(id)) {
        return true; // Nueva semana agregada
      }
    }
    // Detectar semanas eliminadas
    for (const id of idsSemanasOriginales) {
      if (!idsSemanasActuales.has(id)) {
        return true; // Semana eliminada
      }
    }
    
    // Comparar días y ejercicios en cada semana
    for (const semanaActual of semanasActuales) {
      const semanaOriginal = semanasOriginales.find(s => s.id_semana === semanaActual.id_semana);
      if (!semanaOriginal) {
        // Nueva semana, ya detectada arriba, pero también puede tener días/ejercicios nuevos
        if (semanaActual.dias && semanaActual.dias.length > 0) {
          return true; // Nueva semana con contenido
        }
        continue;
      }
      
      const diasOriginales = semanaOriginal.dias || [];
      const diasActuales = semanaActual.dias || [];
      
      // Comparar número de días
      if (diasOriginales.length !== diasActuales.length) {
        return true;
      }
      
      // Comparar IDs de días (para detectar agregaciones y eliminaciones)
      const idsDiasOriginales = new Set(diasOriginales.map(d => d.id_dia));
      const idsDiasActuales = new Set(diasActuales.map(d => d.id_dia));
      
      // Detectar días nuevos (agregados)
      for (const id of idsDiasActuales) {
        if (!idsDiasOriginales.has(id)) {
          return true; // Nuevo día agregado
        }
      }
      // Detectar días eliminados
      for (const id of idsDiasOriginales) {
        if (!idsDiasActuales.has(id)) {
          return true; // Día eliminado
        }
      }
      
      // Comparar ejercicios (dificultades) en cada día
      for (const diaActual of diasActuales) {
        const diaOriginal = diasOriginales.find(d => d.id_dia === diaActual.id_dia);
        if (!diaOriginal) {
          // Nuevo día, ya detectado arriba, pero también puede tener ejercicios nuevos
          if (diaActual.dificultades && diaActual.dificultades.length > 0) {
            return true; // Nuevo día con ejercicios
          }
          continue;
        }
        
        const dificultadesOriginales = diaOriginal.dificultades || [];
        const dificultadesActuales = diaActual.dificultades || [];
        
        // Comparar número de ejercicios (excluyendo los marcados para eliminar)
        const dificultadesOriginalesFiltradas = dificultadesOriginales.filter(
          d => !ejerciciosEliminados.has(d.id_dificultad)
        );
        
        if (dificultadesOriginalesFiltradas.length !== dificultadesActuales.length) {
          return true;
        }
        
        // Comparar IDs de dificultades (para detectar agregaciones y eliminaciones)
        const idsDificultadesOriginales = new Set(dificultadesOriginalesFiltradas.map(d => d.id_dificultad));
        const idsDificultadesActuales = new Set(dificultadesActuales.map(d => d.id_dificultad));
        
        // Detectar ejercicios nuevos (agregados)
        for (const id of idsDificultadesActuales) {
          if (!idsDificultadesOriginales.has(id)) {
            return true; // Nuevo ejercicio agregado
          }
        }
        // Nota: Las eliminaciones ya se manejan con ejerciciosEliminados, pero verificamos por si acaso
        for (const id of idsDificultadesOriginales) {
          if (!idsDificultadesActuales.has(id) && !ejerciciosEliminados.has(id)) {
            return true; // Ejercicio eliminado (no marcado)
          }
        }
      }
    }
    
    return false;
  }, [rutina, rutinaOriginal, ejerciciosEliminados]);

  // Calcular si hay cambios incluyendo dificultades editadas y cambios estructurales
  const tieneCambios = tieneCambiosBase || dificultadesEditadas.size > 0 || tieneCambiosEstructurales;

  const {
    semanaSeleccionada,
    diaSeleccionado,
    semanasDisponibles,
    diasDisponibles,
    setSemanaSeleccionada,
    setDiaSeleccionado,
    handleSemanaChange,
    handleDiaChange
  } = useSemanasDias(rutina);

  const SwalToUse = getSwalInstance(isModal);

  // Si se pasa rutina como prop, actualizar estado
  // IMPORTANTE: Solo actualizar rutinaOriginal en la carga inicial, no cuando rutinaProp cambia
  // Esto permite detectar cambios estructurales (semanas/días/ejercicios agregados/eliminados)
  useEffect(() => {
    if (rutinaProp) {
      setRutina(rutinaProp);
      // Solo actualizar rutinaOriginal si es la primera vez o si el ID cambió (nueva rutina seleccionada)
      if (rutinaOriginalIdRef.current !== rutinaProp.id_rutina) {
        setRutinaOriginal(JSON.parse(JSON.stringify(rutinaProp)));
        rutinaOriginalIdRef.current = rutinaProp.id_rutina;
      }
      setLoading(false);
    }
  }, [rutinaProp]);

  // Cargar datos iniciales (ejercicios y usuarios) cuando se abre el modo edición
  useEffect(() => {
    if (modoEdicion && editando) {
      cargarDatosIniciales();
    }
  }, [modoEdicion, editando]);

  // Cargar usuarios cuando se abre en modo admin (para poder ver clientes)
  // Solo si no se pasaron como prop y no están cargados
  useEffect(() => {
    if (modoEdicion && isModal && rutinaProp) {
      if (usuariosProp && Array.isArray(usuariosProp) && usuariosProp.length > 0) {
        // Ya se actualizó en el useEffect anterior
        return;
      }
      // Si no hay usuarios cargados, cargarlos
      if (usuarios.length === 0) {
        usuarioService.getAllUsuarios()
          .then(usuariosData => setUsuarios(usuariosData))
          .catch(err => console.error("Error al cargar usuarios:", err));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modoEdicion, isModal, rutinaProp]);

  // Cargar rutina activa del usuario (solo si no se pasa como prop)
  useEffect(() => {
    if (rutinaProp) return;

    const cargarRutinaActiva = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const usuario = await usuarioService.getUsuarioById();
        
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

        const rutinaCompleta = await rutinaService.getRutinaById(rutinaActivaId);
        setRutina(rutinaCompleta);
        setRutinaOriginal(JSON.parse(JSON.stringify(rutinaCompleta)));
      } catch (err) {
        console.error("Error al cargar rutina:", err);
        setError("Error al cargar la rutina. Por favor, intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    cargarRutinaActiva();
  }, [rutinaProp]);

  // Cargar ejercicios y usuarios disponibles
  const cargarDatosIniciales = async () => {
    try {
      const [ejerciciosData, usuariosData] = await Promise.all([
        ejercicioService.getAllEjercicios(),
        usuariosProp && Array.isArray(usuariosProp) ? Promise.resolve(usuariosProp) : usuarioService.getAllUsuarios()
      ]);
      setEjerciciosDisponibles(ejerciciosData);
      if (!usuariosProp || !Array.isArray(usuariosProp)) {
        setUsuarios(usuariosData);
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
      SwalToUse.fire({
        title: 'Error',
        text: 'Error al cargar ejercicios o usuarios disponibles.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    }
  };

  // Filtrar ejercicios según semana y día seleccionados (excluyendo eliminados)
  useEffect(() => {
    if (!rutina || !semanaSeleccionada || !diaSeleccionado) {
      setEjerciciosFiltrados([]);
      return;
    }

    const semana = rutina.semanas?.find(s => s.id_semana === semanaSeleccionada);
    if (!semana || !semana.dias) {
      setEjerciciosFiltrados([]);
      return;
    }

    const dia = semana.dias.find(d => d.id_dia === diaSeleccionado);
    if (!dia || !dia.dificultades) {
      setEjerciciosFiltrados([]);
      return;
    }

    const ejercicios = dia.dificultades
      .filter(dificultad => !ejerciciosEliminados.has(dificultad.id_dificultad))
      .map(dificultad => {
        // Usar valores editados si existen, sino usar los originales
        const cambios = dificultadesEditadas.get(dificultad.id_dificultad);
        return {
      id: dificultad.id_dificultad,
          id_ejercicio: dificultad.ejercicio?.id_ejercicio,
      nombre: dificultad.ejercicio?.nombre || 'Ejercicio sin nombre',
          series: cambios?.series ?? dificultad.series ?? 3,
          repeticiones: cambios?.repeticiones ?? dificultad.repeticiones ?? 10,
          peso: cambios?.peso ?? dificultad.peso ?? 1,
      img_url: dificultad.ejercicio?.img_url || null,
      video_url: dificultad.ejercicio?.video_url || null,
        };
      });

    setEjerciciosFiltrados(ejercicios);
  }, [rutina, semanaSeleccionada, diaSeleccionado, ejerciciosEliminados, dificultadesEditadas]);

  // Agregar nueva semana
  const handleAgregarSemana = async () => {
    if (!rutina || !rutina.id_rutina) return;

    const confirmacion = await SwalToUse.fire({
      title: '¿Agregar nueva semana?',
      text: 'Se creará una nueva semana para esta rutina',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
      zIndex: 10002
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const maxNumeroSemana = rutina.semanas && rutina.semanas.length > 0
        ? Math.max(...rutina.semanas.map(s => s.numero_semana))
        : 0;

      const nuevaSemana = await semanaService.createSemana({
        numero_semana: maxNumeroSemana + 1,
        id_rutina: rutina.id_rutina
      });

      const rutinaCompleta = await rutinaService.getRutinaById(rutina.id_rutina);
      setRutina(rutinaCompleta);

      // Rastrear la semana agregada para poder revertirla al cancelar
      if (nuevaSemana.id_semana) {
        setSemanasAgregadas(prev => new Set([...prev, nuevaSemana.id_semana]));
        setSemanaSeleccionada(nuevaSemana.id_semana);
        
        // Seleccionar automáticamente el día 1 de la nueva semana
        const semanaCreada = rutinaCompleta.semanas?.find(s => s.id_semana === nuevaSemana.id_semana);
        if (semanaCreada && semanaCreada.dias && semanaCreada.dias.length > 0) {
          // El día 1 debería ser el primero
          const dia1 = semanaCreada.dias.find(d => d.numero_dia === 1) || semanaCreada.dias[0];
          if (dia1 && dia1.id_dia) {
            setDiaSeleccionado(dia1.id_dia);
            // Rastrear el día agregado también
            setDiasAgregados(prev => new Set([...prev, dia1.id_dia]));
          }
        }
      }

      SwalToUse.fire({
        title: 'Éxito',
        text: 'Semana agregada exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    } catch (err) {
      console.error("Error al agregar semana:", err);
      SwalToUse.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al agregar la semana. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    }
  };

  // Eliminar semana
  const handleEliminarSemana = async (semanaId) => {
    if (!semanaId) return;

    const semana = rutina.semanas?.find(s => s.id_semana === semanaId);
    if (!semana) return;

    if (rutina.semanas && rutina.semanas.length <= 1) {
      SwalToUse.fire({
        title: 'No se puede eliminar',
        text: 'Debe haber al menos una semana en la rutina',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return;
    }

    const confirmacion = await SwalToUse.fire({
      title: '¿Eliminar semana?',
      html: `<p>Se eliminará la <strong>Semana ${semana.numero_semana}</strong> y todos sus días y ejercicios.</p><p>Esta acción no se puede deshacer.</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      zIndex: 10002
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await semanaService.deleteSemana(semanaId);

      const rutinaCompleta = await rutinaService.getRutinaById(rutina.id_rutina);
      setRutina(rutinaCompleta);

      if (rutinaCompleta.semanas && rutinaCompleta.semanas.length > 0) {
        setSemanaSeleccionada(rutinaCompleta.semanas[0].id_semana);
        if (rutinaCompleta.semanas[0].dias && rutinaCompleta.semanas[0].dias.length > 0) {
          setDiaSeleccionado(rutinaCompleta.semanas[0].dias[0].id_dia);
        } else {
          setDiaSeleccionado(null);
        }
      } else {
        setSemanaSeleccionada(null);
        setDiaSeleccionado(null);
      }

      SwalToUse.fire({
        title: 'Éxito',
        text: 'Semana eliminada exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    } catch (err) {
      console.error("Error al eliminar semana:", err);
      SwalToUse.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al eliminar la semana. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    }
  };

  // Agregar nuevo día
  const handleAgregarDia = async () => {
    if (!rutina || !semanaSeleccionada) {
      SwalToUse.fire({
        title: 'Selecciona una semana',
        text: 'Debes seleccionar una semana para agregar un día',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return;
    }

    const semana = rutina.semanas?.find(s => s.id_semana === semanaSeleccionada);
    if (!semana) return;

    const confirmacion = await SwalToUse.fire({
      title: '¿Agregar nuevo día?',
      text: `Se creará un nuevo día para la Semana ${semana.numero_semana}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
      zIndex: 10002
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const maxNumeroDia = semana.dias && semana.dias.length > 0
        ? Math.max(...semana.dias.map(d => d.numero_dia))
        : 0;

      const nuevoDia = await diaService.createDia({
        numero_dia: maxNumeroDia + 1,
        id_semana: semanaSeleccionada
      });

      const rutinaCompleta = await rutinaService.getRutinaById(rutina.id_rutina);
      setRutina(rutinaCompleta);
      
      // Rastrear el día agregado para poder revertirlo al cancelar
      if (nuevoDia.id_dia) {
        setDiasAgregados(prev => new Set([...prev, nuevoDia.id_dia]));
        setDiaSeleccionado(nuevoDia.id_dia);
      }

      SwalToUse.fire({
        title: 'Éxito',
        text: 'Día agregado exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    } catch (err) {
      console.error("Error al agregar día:", err);
      SwalToUse.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al agregar el día. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    }
  };

  // Eliminar día
  const handleEliminarDia = async (diaId) => {
    if (!diaId || !semanaSeleccionada) return;

    const semana = rutina.semanas?.find(s => s.id_semana === semanaSeleccionada);
    if (!semana) return;

    const dia = semana.dias?.find(d => d.id_dia === diaId);
    if (!dia) return;

    if (semana.dias && semana.dias.length <= 1) {
      SwalToUse.fire({
        title: 'No se puede eliminar',
        text: 'Debe haber al menos un día en la semana',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return;
    }

    const confirmacion = await SwalToUse.fire({
      title: '¿Eliminar día?',
      html: `<p>Se eliminará el <strong>Día ${dia.numero_dia}</strong> de la Semana ${semana.numero_semana} y todos sus ejercicios.</p><p>Esta acción no se puede deshacer.</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      zIndex: 10002
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await diaService.deleteDia(diaId);

      const rutinaCompleta = await rutinaService.getRutinaById(rutina.id_rutina);
      setRutina(rutinaCompleta);

      const semanaActualizada = rutinaCompleta.semanas?.find(s => s.id_semana === semanaSeleccionada);
      if (semanaActualizada && semanaActualizada.dias && semanaActualizada.dias.length > 0) {
        setDiaSeleccionado(semanaActualizada.dias[0].id_dia);
      } else {
        setDiaSeleccionado(null);
      }

      SwalToUse.fire({
        title: 'Éxito',
        text: 'Día eliminado exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    } catch (err) {
      console.error("Error al eliminar día:", err);
      SwalToUse.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al eliminar el día. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    }
  };

  // Manejar click en imagen/video
  const handleVerImagen = (imgUrl) => {
    if (imgUrl) {
      window.open(imgUrl, '_blank');
    } else {
      SwalToUse.fire({
        title: 'Sin imagen',
        text: 'No hay imagen disponible para este ejercicio',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    }
  };

  const handleVerVideo = (videoUrl) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    } else {
      SwalToUse.fire({
        title: 'Sin video',
        text: 'No hay video disponible para este ejercicio',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    }
  };

  // Validar datos antes de guardar
  const validarDatos = () => {
    const tipoRutina = datosEditados.tipo_rutina !== undefined ? datosEditados.tipo_rutina : rutina.tipo_rutina;
    // NOTA: usuarioActualId ahora solo viene de datosEditados (no hay rutina.usuario)
    const idUsuario = datosEditados.id_usuario !== undefined ? datosEditados.id_usuario : null;
    const categoria = datosEditados.categoria !== undefined ? datosEditados.categoria : rutina.categoria;

    const validacion = validarDatosRutina(rutina, datosEditados, tipoRutina, idUsuario, categoria);
    if (!validacion.valido) {
      SwalToUse.fire({
        title: 'Error de validación',
        text: validacion.mensaje,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return false;
    }
    return true;
  };

  // Función para cancelar edición y revertir todos los cambios
  const handleCancelar = async () => {
    if (!rutinaOriginal) {
      // Si no hay rutina original, simplemente resetear
      setDificultadesEditadas(new Map());
      setSemanasAgregadas(new Set());
      setDiasAgregados(new Set());
      setEjerciciosAgregados(new Set());
      resetEdit();
      return;
    }

    // Confirmar cancelación si hay cambios
    if (tieneCambios || semanasAgregadas.size > 0 || diasAgregados.size > 0 || ejerciciosAgregados.size > 0) {
      const confirmacion = await SwalToUse.fire({
        title: '¿Cancelar cambios?',
        text: 'Se perderán todos los cambios no guardados. ¿Estás seguro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, continuar editando',
        zIndex: 10002
      });

      if (!confirmacion.isConfirmed) {
        return;
      }
    }

    try {
      // Eliminar ejercicios agregados
      for (const ejercicioId of ejerciciosAgregados) {
        try {
          await dificultadService.deleteDificultad(ejercicioId);
        } catch (err) {
          console.error(`Error al eliminar ejercicio agregado ${ejercicioId}:`, err);
        }
      }

      // Eliminar días agregados (sus ejercicios se eliminarán en cascada)
      for (const diaId of diasAgregados) {
        try {
          await diaService.deleteDia(diaId);
        } catch (err) {
          console.error(`Error al eliminar día agregado ${diaId}:`, err);
        }
      }

      // Eliminar semanas agregadas (sus días y ejercicios se eliminarán en cascada)
      for (const semanaId of semanasAgregadas) {
        try {
          await semanaService.deleteSemana(semanaId);
        } catch (err) {
          console.error(`Error al eliminar semana agregada ${semanaId}:`, err);
        }
      }

      // Recargar la rutina original desde el backend
      const rutinaRestaurada = await rutinaService.getRutinaById(rutinaOriginal.id_rutina);
      setRutina(rutinaRestaurada);
      setRutinaOriginal(JSON.parse(JSON.stringify(rutinaRestaurada)));
      rutinaOriginalIdRef.current = rutinaRestaurada.id_rutina;

      // Limpiar todos los estados de edición
      setDificultadesEditadas(new Map());
      setSemanasAgregadas(new Set());
      setDiasAgregados(new Set());
      setEjerciciosAgregados(new Set());
      resetEdit();

      SwalToUse.fire({
        title: 'Cambios cancelados',
        text: 'Todos los cambios han sido revertidos',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        timer: 2000,
        zIndex: 10002
      });
    } catch (err) {
      console.error("Error al cancelar cambios:", err);
      SwalToUse.fire({
        title: 'Error',
        text: 'Error al revertir los cambios. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    }
  };

  // Guardar cambios de la rutina (actualizar existente)
  const handleGuardarCambios = async () => {
    if (!rutina || !tieneCambios) {
      SwalToUse.fire({
        title: 'Sin cambios',
        text: 'No hay cambios para guardar',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return;
    }

    if (!validarDatos()) return;

    try {
      const datosParaActualizar = {
        nombre: datosEditados.nombre !== undefined ? datosEditados.nombre : rutina.nombre,
        descripcion: datosEditados.descripcion !== undefined ? datosEditados.descripcion : rutina.descripcion
      };

      await rutinaService.updateRutina(rutina.id_rutina, datosParaActualizar);
      
      // Actualizar dificultades editadas
      for (const [dificultadId, cambios] of dificultadesEditadas) {
        try {
          await dificultadService.updateDificultad(dificultadId, cambios);
        } catch (err) {
          console.error(`Error al actualizar dificultad ${dificultadId}:`, err);
        }
      }
      
      // Eliminar ejercicios marcados para eliminar
      for (const dificultadId of ejerciciosEliminados) {
        try {
          await dificultadService.deleteDificultad(dificultadId);
        } catch (err) {
          console.error(`Error al eliminar dificultad ${dificultadId}:`, err);
        }
      }
      
      const rutinaCompleta = await rutinaService.getRutinaById(rutina.id_rutina);
      setRutina(rutinaCompleta);
      setRutinaOriginal(JSON.parse(JSON.stringify(rutinaCompleta)));
      rutinaOriginalIdRef.current = rutinaCompleta.id_rutina; // Actualizar referencia
      setDificultadesEditadas(new Map());
      setSemanasAgregadas(new Set());
      setDiasAgregados(new Set());
      setEjerciciosAgregados(new Set());
      resetEdit();
      
      if (onRutinaActualizada) {
        onRutinaActualizada(rutinaCompleta);
      }
      
      SwalToUse.fire({
        title: 'Éxito',
        text: 'Rutina actualizada exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    } catch (err) {
      console.error("Error al actualizar rutina:", err);
      SwalToUse.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al actualizar la rutina. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    }
  };

  // Guardar como nueva rutina
  const handleGuardarComoNueva = async () => {
    if (!rutina) return;

    if (!validarDatos()) return;

    const tipoRutina = datosEditados.tipo_rutina !== undefined ? datosEditados.tipo_rutina : rutina.tipo_rutina;
    // NOTA: usuarioActualId ahora solo viene de datosEditados (no hay rutina.usuario)
    const idUsuario = datosEditados.id_usuario !== undefined ? datosEditados.id_usuario : null;

    const confirmacion = await SwalToUse.fire({
      title: '¿Crear nueva rutina?',
      html: `
        <p>Se creará una nueva rutina basada en la actual.</p>
        ${tipoRutina === 'cliente' && idUsuario ? 
          `<p><strong>⚠️ La nueva rutina se asignará automáticamente como activa al cliente seleccionado.</strong></p>` : 
          ''}
        <p>¿Deseas continuar?</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ff6a00',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, crear nueva rutina',
      cancelButtonText: 'Cancelar',
      zIndex: 10002
    });

    if (!confirmacion.isConfirmed) return;

    try {
      let nombre = datosEditados.nombre !== undefined ? datosEditados.nombre : rutina.nombre;
      
      // Validar que el nombre no exista
      const todasLasRutinas = await rutinaService.getAllRutinas();
      const nombreExiste = todasLasRutinas.some(r => r.nombre.toLowerCase().trim() === nombre.toLowerCase().trim());
      
      if (nombreExiste) {
        const { value: nuevoNombre } = await SwalToUse.fire({
          title: 'Nombre duplicado',
          html: `
            <p>Ya existe una rutina con el nombre "<strong>${nombre}</strong>".</p>
            <p>Por favor, ingresa un nombre diferente:</p>
          `,
          input: 'text',
          inputValue: nombre,
          inputPlaceholder: 'Nombre de la rutina',
          showCancelButton: true,
          confirmButtonColor: '#ff6a00',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          inputValidator: (value) => {
            if (!value || !value.trim()) {
              return 'El nombre no puede estar vacío';
            }
            const nombreDuplicado = todasLasRutinas.some(r => 
              r.nombre.toLowerCase().trim() === value.toLowerCase().trim()
            );
            if (nombreDuplicado) {
              return 'Este nombre ya existe. Por favor, elige otro.';
            }
            return null;
          },
          zIndex: 10002
        });
        
        if (!nuevoNombre) {
          return; // Usuario canceló
        }
        
        nombre = nuevoNombre.trim();
      }
      const descripcion = datosEditados.descripcion !== undefined ? datosEditados.descripcion : rutina.descripcion;
      const nivel = datosEditados.nivel !== undefined ? datosEditados.nivel : rutina.nivel;
      const categoria = datosEditados.categoria !== undefined ? datosEditados.categoria : rutina.categoria;

      let tipoRutinaFinal = tipoRutina;
      if (!idUsuario && tipoRutinaFinal === 'cliente') {
        tipoRutinaFinal = 'general';
      } else if (idUsuario && tipoRutinaFinal === 'general') {
        tipoRutinaFinal = 'cliente';
      }

      const semanasData = rutina.semanas.map(semana => ({
        numero_semana: semana.numero_semana,
        dias: semana.dias.map(dia => ({
          numero_dia: dia.numero_dia,
          ejercicios: dia.dificultades
            .filter(dificultad => !ejerciciosEliminados.has(dificultad.id_dificultad))
            .map(dificultad => {
              // Usar valores editados si existen, sino usar los originales
              const cambios = dificultadesEditadas.get(dificultad.id_dificultad);
              return {
                ejercicioId: dificultad.ejercicio.id_ejercicio,
                series: cambios?.series ?? dificultad.series ?? 3,
                repeticiones: cambios?.repeticiones ?? dificultad.repeticiones ?? 10,
                peso: cambios?.peso ?? dificultad.peso ?? 1
              };
            })
        }))
      }));

      const rutinaCompletaData = {
        nombre,
        descripcion,
        nivel,
        tipo_rutina: tipoRutinaFinal,
        categoria: tipoRutinaFinal === 'plan' ? categoria : undefined,
        id_usuario: tipoRutinaFinal === 'cliente' ? idUsuario : undefined,
        semanas: semanasData
      };

      const nuevaRutina = await rutinaService.createRutinaCompleta(rutinaCompletaData);

      // NOTA: El backend automáticamente asigna la rutina como activa cuando es tipo CLIENTE y tiene id_usuario
      // No es necesario hacer una llamada adicional aquí

      const rutinaCompleta = await rutinaService.getRutinaById(rutina.id_rutina);
      setRutina(rutinaCompleta);
      setRutinaOriginal(JSON.parse(JSON.stringify(rutinaCompleta)));
      rutinaOriginalIdRef.current = rutinaCompleta.id_rutina; // Actualizar referencia
      setDificultadesEditadas(new Map());
      setSemanasAgregadas(new Set());
      setDiasAgregados(new Set());
      setEjerciciosAgregados(new Set());
      resetEdit();
      
      if (onRutinaActualizada) {
        onRutinaActualizada(rutinaCompleta);
      }
      
      SwalToUse.fire({
        title: 'Éxito',
        text: 'Nueva rutina creada exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    } catch (err) {
      console.error("Error al crear nueva rutina:", err);
      SwalToUse.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al crear la nueva rutina. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    }
  };

  // Manejar edición de dificultad (guarda cambios localmente, no actualiza backend inmediatamente)
  const handleEditarDificultad = (dificultadId, campo, valor) => {
    // Obtener la dificultad original de la rutina
    let dificultadOriginal = null;
    if (rutina && semanaSeleccionada && diaSeleccionado) {
      const semana = rutina.semanas?.find(s => s.id_semana === semanaSeleccionada);
      if (semana) {
        const dia = semana.dias?.find(d => d.id_dia === diaSeleccionado);
        if (dia && dia.dificultades) {
          dificultadOriginal = dia.dificultades.find(d => d.id_dificultad === dificultadId);
        }
      }
    }
    
    if (!dificultadOriginal) return;
    
    // Actualizar el mapa de dificultades editadas
    setDificultadesEditadas(prev => {
      const nuevoMap = new Map(prev);
      const cambiosActuales = nuevoMap.get(dificultadId) || {
        series: dificultadOriginal.series,
        repeticiones: dificultadOriginal.repeticiones,
        peso: dificultadOriginal.peso
      };
      
      cambiosActuales[campo] = valor;
      
      // Si los valores son iguales a los originales, eliminar del mapa
      if (cambiosActuales.series === dificultadOriginal.series &&
          cambiosActuales.repeticiones === dificultadOriginal.repeticiones &&
          cambiosActuales.peso === dificultadOriginal.peso) {
        nuevoMap.delete(dificultadId);
      } else {
        nuevoMap.set(dificultadId, cambiosActuales);
      }
      
      return nuevoMap;
    });
    
    // Actualizar también ejerciciosFiltrados para reflejar el cambio visualmente
    setEjerciciosFiltrados(prev => prev.map(ej => {
      if (ej.id === dificultadId) {
        return { ...ej, [campo]: valor };
      }
      return ej;
    }));
  };

  // Función para mostrar usuarios que tienen esta rutina activa
  const handleVerClientesConRutina = () => {
    if (!rutina || !rutina.id_rutina) {
      SwalToUse.fire({
        title: 'Error',
        text: 'No hay rutina seleccionada',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return;
    }

    // Filtrar usuarios que tienen esta rutina como activa
    const usuariosConRutina = usuarios.filter(usuario => {
      if (!usuario.rutina_activa) return false;
      const rutinaActivaId = usuario.rutina_activa.id_rutina || usuario.rutina_activa;
      return rutinaActivaId === rutina.id_rutina;
    });

    if (usuariosConRutina.length === 0) {
      SwalToUse.fire({
        title: 'Sin clientes',
        html: `<p>No hay clientes que tengan la rutina "<strong>${rutina.nombre}</strong>" como activa.</p>`,
        icon: 'info',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return;
    }

    // Función helper para obtener el plan de un usuario
    const obtenerPlanUsuario = (usuario) => {
      if (!usuario?.suscripciones || !Array.isArray(usuario.suscripciones) || usuario.suscripciones.length === 0) {
        return 'Sin plan';
      }
      
      const suscripcionActiva = usuario.suscripciones.find(s => 
        s && s.estado && String(s.estado).toUpperCase() === 'ACTIVA'
      );
      const suscripcion = suscripcionActiva || usuario.suscripciones[0];
      
      if (suscripcion && suscripcion.plan && suscripcion.plan.nombre) {
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

    // Crear HTML con la lista de usuarios
    const usuariosHTML = usuariosConRutina.map(usuario => {
      const plan = obtenerPlanUsuario(usuario);
      return `
        <div style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${usuario.nombre} ${usuario.apellido}</strong><br>
          <span style="color: #666; font-size: 0.9em;">
            Email: ${usuario.email} | Plan: ${plan}
          </span>
        </div>
      `;
    }).join('');

    SwalToUse.fire({
      title: `Clientes con la rutina "${rutina.nombre}"`,
      html: `
        <div style="text-align: left; max-height: 400px; overflow-y: auto;">
          <p style="margin-bottom: 15px; font-weight: bold;">
            Total: ${usuariosConRutina.length} cliente${usuariosConRutina.length !== 1 ? 's' : ''}
          </p>
          ${usuariosHTML}
        </div>
      `,
      icon: 'info',
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Cerrar',
      width: '600px',
      zIndex: 10002
    });
  };

  // Eliminar rutina completa
  const handleEliminarRutina = async () => {
    if (!rutina || !rutina.id_rutina) {
      SwalToUse.fire({
        title: 'Error',
        text: 'No hay rutina seleccionada para eliminar',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return;
    }

    const confirmacion = await SwalToUse.fire({
      title: '¿Eliminar rutina?',
      html: `
        <p>¿Estás seguro de que deseas eliminar la rutina "<strong>${rutina.nombre}</strong>"?</p>
        <p style="color: #dc3545; font-weight: bold;">Esta acción no se puede deshacer.</p>
        <p>Se eliminarán todas las semanas, días y ejercicios asociados.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      zIndex: 10002
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    // Delega eliminación al componente padre
    // AdminRutinas maneja la eliminación y actualización de la lista
    if (onEliminarRutina) {
      onEliminarRutina(rutina.id_rutina);
    }
  };

  // Eliminar ejercicio
  const handleEliminarEjercicio = async (dificultadId) => {
    const confirmacion = await SwalToUse.fire({
      title: '¿Eliminar ejercicio?',
      text: 'Se eliminará permanentemente este ejercicio de la rutina. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      zIndex: 10002
    });

    if (!confirmacion.isConfirmed) return;

    // Crear nuevo Set para forzar actualización de React
    const nuevoSet = new Set(ejerciciosEliminados);
    nuevoSet.add(dificultadId);
    setEjerciciosEliminados(nuevoSet);
    
    // Forzar actualización inmediata de ejercicios filtrados
    if (rutina && semanaSeleccionada && diaSeleccionado) {
      const semana = rutina.semanas?.find(s => s.id_semana === semanaSeleccionada);
      if (semana) {
        const dia = semana.dias?.find(d => d.id_dia === diaSeleccionado);
        if (dia && dia.dificultades) {
          const ejercicios = dia.dificultades
            .filter(dificultad => !nuevoSet.has(dificultad.id_dificultad))
            .map(dificultad => {
              const cambios = dificultadesEditadas.get(dificultad.id_dificultad);
              return {
                id: dificultad.id_dificultad,
                id_ejercicio: dificultad.ejercicio?.id_ejercicio,
                nombre: dificultad.ejercicio?.nombre || 'Ejercicio sin nombre',
                series: cambios?.series ?? dificultad.series ?? 3,
                repeticiones: cambios?.repeticiones ?? dificultad.repeticiones ?? 10,
                peso: cambios?.peso ?? dificultad.peso ?? 1,
                img_url: dificultad.ejercicio?.img_url || null,
                video_url: dificultad.ejercicio?.video_url || null,
              };
            });
          setEjerciciosFiltrados(ejercicios);
        }
      }
    }
    
    SwalToUse.fire({
      title: 'Ejercicio eliminado',
      text: 'El ejercicio se eliminará permanentemente cuando guardes los cambios',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      timer: 2000,
      zIndex: 10002
    });
  };

  // Abrir modal para agregar ejercicio
  const handleAbrirModalAgregarEjercicio = () => {
    if (!semanaSeleccionada || !diaSeleccionado) {
      SwalToUse.fire({
        title: 'Selecciona día',
        text: 'Debes seleccionar una semana y un día antes de agregar ejercicios',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return;
    }
    setMostrarModalAgregarEjercicio(true);
  };

  // Agregar ejercicio existente
  const handleAgregarEjercicioExistente = async (ejercicioId) => {
    if (!semanaSeleccionada || !diaSeleccionado) {
      SwalToUse.fire({
        title: 'Error',
        text: 'Debes seleccionar una semana y un día antes de agregar ejercicios',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return;
    }

    if (!rutina || !rutina.id_rutina) {
      SwalToUse.fire({
        title: 'Error',
        text: 'No hay rutina seleccionada',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return;
    }

    try {
      const dificultadCreada = await dificultadService.createDificultad({
        diaId: diaSeleccionado,
        ejercicioId: ejercicioId,
        series: 3,
        repeticiones: 10,
        peso: 1
      });

      // Rastrear el ejercicio agregado para poder revertirlo al cancelar
      if (dificultadCreada && dificultadCreada.id_dificultad) {
        setEjerciciosAgregados(prev => new Set([...prev, dificultadCreada.id_dificultad]));
      }

      // Recargar la rutina completa para obtener los cambios
      // Usamos un pequeño delay para asegurar que el backend haya procesado el cambio
      await new Promise(resolve => setTimeout(resolve, 200));
      
        const rutinaActualizada = await rutinaService.getRutinaById(rutina.id_rutina);
      
      // Asegurar que mantenemos la selección actual de semana y día
        setRutina(rutinaActualizada);
      
      // Forzar actualización de ejercicios filtrados manualmente
      if (rutinaActualizada && semanaSeleccionada && diaSeleccionado) {
        const semana = rutinaActualizada.semanas?.find(s => s.id_semana === semanaSeleccionada);
        if (semana) {
          const dia = semana.dias?.find(d => d.id_dia === diaSeleccionado);
          if (dia && dia.dificultades) {
            const ejercicios = dia.dificultades
              .filter(dificultad => !ejerciciosEliminados.has(dificultad.id_dificultad))
              .map(dificultad => ({
                id: dificultad.id_dificultad,
                id_ejercicio: dificultad.ejercicio?.id_ejercicio,
                nombre: dificultad.ejercicio?.nombre || 'Ejercicio sin nombre',
                series: dificultad.series ?? 3,
                repeticiones: dificultad.repeticiones ?? 10,
                peso: dificultad.peso ?? 1,
                img_url: dificultad.ejercicio?.img_url || null,
                video_url: dificultad.ejercicio?.video_url || null,
              }));
            setEjerciciosFiltrados(ejercicios);
          }
        }
      }
        
        if (onRutinaActualizada) {
          onRutinaActualizada(rutinaActualizada);
        }

      setMostrarModalAgregarEjercicio(false);
      SwalToUse.fire({
        title: 'Éxito',
        text: 'Ejercicio agregado exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    } catch (err) {
      console.error("Error al agregar ejercicio:", err);
      SwalToUse.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al agregar el ejercicio. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    }
  };

  // Crear nuevo ejercicio y agregarlo
  const handleCrearYAgregarEjercicio = async (ejercicioData = null) => {
    // Usar los datos pasados como parámetro o el estado actual
    const datosEjercicio = ejercicioData || nuevoEjercicio;
    
    if (!datosEjercicio.nombre || datosEjercicio.nombre.trim() === '') {
      SwalToUse.fire({
        title: 'Error de validación',
        text: 'El nombre del ejercicio es requerido',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return;
    }

    if (!semanaSeleccionada || !diaSeleccionado) {
      SwalToUse.fire({
        title: 'Error',
        text: 'Debes seleccionar una semana y un día antes de agregar ejercicios',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return;
    }

    if (!rutina || !rutina.id_rutina) {
      SwalToUse.fire({
        title: 'Error',
        text: 'No hay rutina seleccionada',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
      return;
    }

    try {
      const ejercicioCreado = await ejercicioService.createEjercicio(datosEjercicio);

      const dificultadCreada = await dificultadService.createDificultad({
        diaId: diaSeleccionado,
        ejercicioId: ejercicioCreado.id_ejercicio,
        series: 3,
        repeticiones: 10,
        peso: 1
      });

      // Rastrear el ejercicio agregado para poder revertirlo al cancelar
      if (dificultadCreada && dificultadCreada.id_dificultad) {
        setEjerciciosAgregados(prev => new Set([...prev, dificultadCreada.id_dificultad]));
      }

      const [ejerciciosData, rutinaActualizada] = await Promise.all([
        ejercicioService.getAllEjercicios(),
        rutinaService.getRutinaById(rutina.id_rutina)
      ]);
      
      setEjerciciosDisponibles(ejerciciosData);
      setRutina(rutinaActualizada);
      
      if (onRutinaActualizada) {
        onRutinaActualizada(rutinaActualizada);
      }

      setNuevoEjercicio({
        nombre: "",
        detalle: "",
        tipo: "",
        grupo_muscular: "",
        img_url: "",
        video_url: ""
      });
      setCrearNuevoEjercicio(false);
      setMostrarModalAgregarEjercicio(false);

      SwalToUse.fire({
        title: 'Éxito',
        text: 'Ejercicio creado y agregado exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    } catch (err) {
      console.error("Error al crear ejercicio:", err);
      SwalToUse.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al crear el ejercicio. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
    }
  };

  // Handlers para el modal
  const handleNuevoEjercicioChange = (campo, valor) => {
    setNuevoEjercicio(prev => ({ ...prev, [campo]: valor }));
  };

  const handleResetModal = () => {
    setMostrarModalAgregarEjercicio(false);
    setCrearNuevoEjercicio(false);
    setNuevoEjercicio({
      nombre: "",
      detalle: "",
      tipo: "",
      grupo_muscular: "",
      img_url: "",
      video_url: ""
    });
  };

  if (loading) {
    return (
      <div className="tabla-contenedor">
        <p className="tabla-loading">Cargando rutina...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tabla-contenedor">
        <p className="tabla-error">{error}</p>
      </div>
    );
  }

  if (!rutina) {
    return (
      <div className="tabla-contenedor">
        <p className="tabla-empty">No se encontró la rutina activa</p>
      </div>
    );
  }

  return (
    <div className={`tabla-contenedor ${isModal ? 'tabla-contenedor-modal' : ''}`}>
      <RutinaInfoHeader
        rutina={rutina}
        modoEdicion={modoEdicion}
        editando={editando}
        datosEditados={datosEditados}
        usuarios={usuarios}
        requiereNuevaRutina={requiereNuevaRutina}
        onEditarCampo={handleEditarCampo}
        isModal={isModal}
        onClose={onClose}
      />

      <RutinaActionButtons
        modoEdicion={modoEdicion}
        editando={editando}
        requiereNuevaRutina={requiereNuevaRutina}
        tieneCambios={tieneCambios}
        onEditar={() => setEditando(true)}
        onGuardarCambios={handleGuardarCambios}
        onGuardarComoNueva={handleGuardarComoNueva}
        onCancelar={handleCancelar}
        onEliminar={handleEliminarRutina}
        onVerClientes={handleVerClientesConRutina}
        isModal={isModal}
      />

      <SemanaDiaSelectors
        semanasDisponibles={semanasDisponibles}
        diasDisponibles={diasDisponibles}
        semanaSeleccionada={semanaSeleccionada}
        diaSeleccionado={diaSeleccionado}
        modoEdicion={modoEdicion}
        editando={editando}
        onSemanaChange={handleSemanaChange}
        onDiaChange={handleDiaChange}
        onAgregarSemana={handleAgregarSemana}
        onEliminarSemana={handleEliminarSemana}
        onAgregarDia={handleAgregarDia}
        onEliminarDia={handleEliminarDia}
        onAgregarEjercicio={handleAbrirModalAgregarEjercicio}
      />

      <EjerciciosTable
        ejercicios={ejerciciosFiltrados}
        modoEdicion={modoEdicion}
        editando={editando}
        semanaSeleccionada={semanaSeleccionada}
        diaSeleccionado={diaSeleccionado}
        onEditarDificultad={handleEditarDificultad}
        onEliminarEjercicio={handleEliminarEjercicio}
        onVerImagen={handleVerImagen}
        onVerVideo={handleVerVideo}
                    />

      <ModalAgregarEjercicio
        isOpen={mostrarModalAgregarEjercicio}
        onClose={handleResetModal}
        ejerciciosDisponibles={ejerciciosDisponibles}
        crearNuevoEjercicio={crearNuevoEjercicio}
        nuevoEjercicio={nuevoEjercicio}
        onToggleCrearNuevo={() => setCrearNuevoEjercicio(!crearNuevoEjercicio)}
        onNuevoEjercicioChange={handleNuevoEjercicioChange}
        onAgregarEjercicioExistente={handleAgregarEjercicioExistente}
        onCrearYAgregarEjercicio={handleCrearYAgregarEjercicio}
        onResetForm={handleResetModal}
      />
    </div>
  );
}
