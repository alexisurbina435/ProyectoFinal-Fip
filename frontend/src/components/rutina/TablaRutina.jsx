import React, { useState, useEffect } from "react";
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

export default function TablaRutina({ rutinaProp = null, modoEdicion = false, onRutinaActualizada = null, isModal = false, onClose = null, onEliminarRutina = null }) {
  const [rutina, setRutina] = useState(rutinaProp);
  const [rutinaOriginal, setRutinaOriginal] = useState(null);
  const [loading, setLoading] = useState(!rutinaProp);
  const [error, setError] = useState(null);
  const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState([]);
  
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
  
  // Estado para rastrear cambios en dificultades (series, repeticiones, peso)
  const [dificultadesEditadas, setDificultadesEditadas] = useState(new Map()); // Map<dificultadId, {series, repeticiones, peso}>

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
  
  // Calcular si hay cambios incluyendo dificultades editadas
  const tieneCambios = tieneCambiosBase || dificultadesEditadas.size > 0;

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
  useEffect(() => {
    if (rutinaProp) {
      setRutina(rutinaProp);
      setRutinaOriginal(JSON.parse(JSON.stringify(rutinaProp)));
      setLoading(false);
    }
  }, [rutinaProp]);

  // Cargar datos iniciales (ejercicios y usuarios) cuando se abre el modo edición
  useEffect(() => {
    if (modoEdicion && editando) {
      cargarDatosIniciales();
    }
  }, [modoEdicion, editando]);

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
        usuarioService.getAllUsuarios()
      ]);
      setEjerciciosDisponibles(ejerciciosData);
      setUsuarios(usuariosData);
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
        rutina: { id_rutina: rutina.id_rutina }
      });

      const rutinaCompleta = await rutinaService.getRutinaById(rutina.id_rutina);
      setRutina(rutinaCompleta);
      setRutinaOriginal(JSON.parse(JSON.stringify(rutinaCompleta)));

      if (nuevaSemana.id_semana) {
        setSemanaSeleccionada(nuevaSemana.id_semana);
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
      setRutinaOriginal(JSON.parse(JSON.stringify(rutinaCompleta)));

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
        semana: { id_semana: semanaSeleccionada }
      });

      const rutinaCompleta = await rutinaService.getRutinaById(rutina.id_rutina);
      setRutina(rutinaCompleta);
      setRutinaOriginal(JSON.parse(JSON.stringify(rutinaCompleta)));

      if (nuevoDia.id_dia) {
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
      setRutinaOriginal(JSON.parse(JSON.stringify(rutinaCompleta)));

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
    const idUsuario = datosEditados.id_usuario !== undefined ? datosEditados.id_usuario : (rutina.usuario?.id_usuario || null);
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
      setDificultadesEditadas(new Map());
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
    const idUsuario = datosEditados.id_usuario !== undefined ? datosEditados.id_usuario : (rutina.usuario?.id_usuario || null);

    const confirmacion = await SwalToUse.fire({
      title: '¿Crear nueva rutina?',
      html: `
        <p>Se creará una nueva rutina basada en la actual.</p>
        ${tipoRutina === 'cliente' && idUsuario ? 
          `<p><strong>La nueva rutina se asignará como activa al cliente seleccionado.</strong></p>` : 
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

      if (tipoRutinaFinal === 'cliente' && idUsuario) {
        const asignarActiva = await SwalToUse.fire({
          title: '¿Asignar como rutina activa?',
          text: `¿Deseas asignar esta rutina como activa para el cliente?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#ff6a00',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Sí, asignar',
          cancelButtonText: 'No asignar',
          zIndex: 10002
        });

        if (asignarActiva.isConfirmed) {
          await usuarioService.updateUsuario(idUsuario, {
            rutina_activa_id: nuevaRutina.id_rutina
          });
        }
      }

      const rutinaCompleta = await rutinaService.getRutinaById(rutina.id_rutina);
      setRutina(rutinaCompleta);
      setRutinaOriginal(JSON.parse(JSON.stringify(rutinaCompleta)));
      setDificultadesEditadas(new Map());
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

    try {
      await rutinaService.deleteRutina(rutina.id_rutina);
      
      SwalToUse.fire({
        title: 'Éxito',
        text: 'Rutina eliminada exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });

      // Cerrar el modal si está abierto
      if (onClose) {
        onClose();
      }

      // Notificar al componente padre para que actualice la lista
      if (onEliminarRutina) {
        onEliminarRutina(rutina.id_rutina);
      }
    } catch (err) {
      console.error("Error al eliminar rutina:", err);
      SwalToUse.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al eliminar la rutina. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        zIndex: 10002
      });
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
      await dificultadService.createDificultad({
        diaId: diaSeleccionado,
        ejercicioId: ejercicioId,
        series: 3,
        repeticiones: 10,
        peso: 1
      });

      // Recargar la rutina completa para obtener los cambios
      // Usamos un pequeño delay para asegurar que el backend haya procesado el cambio
      await new Promise(resolve => setTimeout(resolve, 200));
      
        const rutinaActualizada = await rutinaService.getRutinaById(rutina.id_rutina);
      
      // Asegurar que mantenemos la selección actual de semana y día
        setRutina(rutinaActualizada);
      setRutinaOriginal(JSON.parse(JSON.stringify(rutinaActualizada)));
      
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

      await dificultadService.createDificultad({
        diaId: diaSeleccionado,
        ejercicioId: ejercicioCreado.id_ejercicio,
        series: 3,
        repeticiones: 10,
        peso: 1
      });

      const [ejerciciosData, rutinaActualizada] = await Promise.all([
        ejercicioService.getAllEjercicios(),
        rutinaService.getRutinaById(rutina.id_rutina)
      ]);
      
      setEjerciciosDisponibles(ejerciciosData);
      setRutina(rutinaActualizada);
      setRutinaOriginal(JSON.parse(JSON.stringify(rutinaActualizada)));
      
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
        onCancelar={() => {
          setDificultadesEditadas(new Map());
          resetEdit();
        }}
        onEliminar={handleEliminarRutina}
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
