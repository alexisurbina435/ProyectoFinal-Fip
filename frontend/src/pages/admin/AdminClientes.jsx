import { useState, useEffect, useMemo } from "react";
import Header from "../../components/header/Header"
import Tabla from "../../components/Tabla/Tabla"
import AdminBar from "../../components/AdminBar/AdminBar"
import usuarioService from "../../services/usuario.service";
import rutinaService from "../../services/rutina.service";
import suscripcionService from "../../services/suscripcion.service";
import planService from "../../services/plan.service";
import PopUpEdit from "../../components/popUpEdit/PopUpEdit";
import { getUsuarioFields, getPlanLabel } from "../../components/popUpEdit/fields/usuarioFields";
import PlanillaPdf from "../../components/convertidorPdf/PlanillaPdf";
import ModalCrearRutina from "../../components/rutina/ModalCrearRutina";
import Swal from 'sweetalert2';
import "./admin.css";
const AdminClientes = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewUsuario, setViewUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rutinas, setRutinas] = useState([]);
  const [isRutinaModalOpen, setIsRutinaModalOpen] = useState(false);
  const [rutinaAction, setRutinaAction] = useState(null); // 'eliminar', 'cambiar', 'crear'
  const [rutinaPendiente, setRutinaPendiente] = useState(null); // null = desvincular, number = id de rutina, undefined = sin cambios
  const [planes, setPlanes] = useState([]);
  const [planOriginal, setPlanOriginal] = useState(null); // Plan original antes de editar

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
    cargarRutinas();
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    try {
      const response = await planService.getAllPlans();
      setPlanes(response);
    } catch (err) {
      console.error("Error al cargar planes:", err);
    }
  };

  const cargarRutinas = async () => {
    try {
      const response = await rutinaService.getAllRutinas();
      setRutinas(response);
    } catch (err) {
      console.error("Error al cargar rutinas:", err);
    }
  };

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usuarioService.getAllUsuarios();
      setUsuarios(response);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("Error al cargar los clientes. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Transformar datos del backend al formato de la tabla
  const transformarDatos = (usuarios) => {
    return usuarios.map(usuario => {
      // Obtener el plan desde suscripciones
      let planValue = null;
      
      if (usuario?.suscripciones && Array.isArray(usuario.suscripciones) && usuario.suscripciones.length > 0) {
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
          planValue = planMapping[planNombre] || suscripcion.plan.nombre;
        }
      }

      // Obtener información de la rutina activa
      let rutinaInfo = "Sin rutina";
      if (usuario?.rutina_activa) {
        rutinaInfo = usuario.rutina_activa.nombre || `Rutina #${usuario.rutina_activa.id_rutina}`;
      }

      // Agrupar preferencias en una sola celda
      const preferencias = [];
      if (usuario.aceptarEmails) preferencias.push('Email');
      if (usuario.aceptarWpp) preferencias.push('WhatsApp');
      if (usuario.aceptarTerminos) preferencias.push('Términos');
      const preferenciasText = preferencias.length > 0 ? preferencias.join(', ') : 'Ninguna';

      // Formatear el rol para mostrar
      let rolFormateado = 'Usuario';
      if (usuario.rol) {
        const rolLower = String(usuario.rol).toLowerCase();
        if (rolLower === 'admin' || rolLower === 'administrador') {
          rolFormateado = 'Administrador';
        } else {
          rolFormateado = 'Usuario';
        }
      }

      return {
        id: usuario.id_usuario || usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: rolFormateado,
        plan: getPlanLabel(planValue),
        rutina: rutinaInfo,
        estado: usuario.estado_pago ? 'Activo' : 'Inactivo',
        ficha: usuario?.ficha?.id_ficha
          ? <PlanillaPdf ficha={usuario.ficha} />
          : "Sin ficha",
        preferencias: preferenciasText,
      };
    });
  };

  // Calcular contadores de clientes
  const contadoresClientes = useMemo(() => {
    const total = usuarios.length;
    const activos = usuarios.filter(usuario => usuario.estado_pago === true).length;
    const inactivos = total - activos;
    return { total, activos, inactivos };
  }, [usuarios]);

  // Filtrar datos segun el termino de busqueda
  const datosFiltrados = useMemo(() => {
    const datosTransformados = transformarDatos(usuarios);

    if (!searchTerm.trim()) {
      return datosTransformados;
    }

    const termino = searchTerm.toLowerCase().trim();

    return datosTransformados.filter(item => {
      // Buscar en todos los campos de la tabla
      return Object.values(item).some(value => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(termino);
      });
    });
  }, [usuarios, searchTerm]);

  const data = datosFiltrados;

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'apellido', label: 'Apellido', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'telefono', label: 'Teléfono', sortable: false },
    { key: 'rol', label: 'Rol', sortable: true },
    { key: 'plan', label: 'Plan', sortable: true, clickable: true },
    { key: 'rutina', label: 'Rutina', sortable: true },
    { key: 'estado', label: 'Estado', sortable: true,
      render: (value) => {
        let colorClass = '';
        if (value === 'Activo') colorClass = 'status-activo';
        else if (value === 'Inactivo') colorClass = 'status-inactivo';
        else if (value === 'Pendiente') colorClass = 'status-pendiente';

        return <span className={`status-badge ${colorClass}`}>{value}</span>;
      }
    },
    { key: 'ficha', label: 'Ficha', sortable: true },
    { key: 'preferencias', label: 'Preferencias', sortable: false },
  ];


  const placeholder = 'cliente';

  const camposUsuario = useMemo(
    () => getUsuarioFields({ mode: modalMode }),
    [modalMode]
  );

  const camposUsuarioView = useMemo(
    () => getUsuarioFields({ mode: 'view' }),
    []
  );

  // Funcion para limpiar datos antes de enviar al backend
  const limpiarDatosUsuario = (usuarioData, mode) => {
    const datosLimpios = { ...usuarioData };

    // Eliminar campos que no deberian enviarse
    delete datosLimpios.id;
    delete datosLimpios.id_usuario;
    delete datosLimpios.ficha;
    delete datosLimpios.confirmPassword;
    delete datosLimpios.tipoPlan; // tipoPlan no existe en el DTO del backend
    delete datosLimpios.suscripciones; // Las suscripciones se manejan por separado
    delete datosLimpios.rutina_activa; // Se maneja con rutina_activa_id
    delete datosLimpios.rutinas; // No se actualiza desde aquí

    // Convertir rol a minúsculas (el backend espera 'usuario' o 'admin')
    if (datosLimpios.rol) {
      datosLimpios.rol = datosLimpios.rol.toLowerCase();
    }

    // En modo edit, SIEMPRE eliminar password (no se debe modificar desde AdminClientes)
    // El password solo se cambia desde el perfil del usuario o al crear un nuevo usuario
    // Esto previene que el hash del password se envíe y se hashee de nuevo en el backend
    if (mode === 'edit') {
      delete datosLimpios.password;
      delete datosLimpios.confirmPassword; // También eliminar confirmPassword si existe
    }

    // Asegurar que los booleanos sean realmente booleanos
    if (datosLimpios.estado_pago !== undefined) {
      datosLimpios.estado_pago = Boolean(datosLimpios.estado_pago);
    }
    if (datosLimpios.aceptarEmails !== undefined) {
      datosLimpios.aceptarEmails = Boolean(datosLimpios.aceptarEmails);
    }
    if (datosLimpios.aceptarWpp !== undefined) {
      datosLimpios.aceptarWpp = Boolean(datosLimpios.aceptarWpp);
    }
    if (datosLimpios.aceptarTerminos !== undefined) {
      datosLimpios.aceptarTerminos = Boolean(datosLimpios.aceptarTerminos);
    }

    // Eliminar campos undefined o null
    Object.keys(datosLimpios).forEach(key => {
      if (datosLimpios[key] === undefined || datosLimpios[key] === null) {
        delete datosLimpios[key];
      }
    });

    return datosLimpios;
  };

  // Funcion para agregar nuevo cliente
  const handleAddClick = () => {
    setModalMode('create');
    setSelectedUsuario(null);
    setIsModalOpen(true);
  };

  // Funcion para manejar el submit del formulario
  const handleFormSubmit = async (usuarioData) => {
    try {
      if (modalMode === 'create') {
        const datosLimpios = limpiarDatosUsuario(usuarioData, 'create');
        console.log('Datos a enviar al backend (create):', datosLimpios);
        await usuarioService.register(datosLimpios);
        await cargarUsuarios();
        Swal.fire({
          title: 'Cliente creado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } else {
        await handleUpdateUsuario(selectedUsuario.id_usuario || selectedUsuario.id, usuarioData);
      }
    } catch (err) {
      console.error("Error al procesar usuario:", err);
      throw err; // Re-lanzar para que el componente maneje el error
    }
  };

  // Funcion para ver detalles de un cliente
  const handleVerDetalles = async (id) => {
    try {
      const usuario = await usuarioService.getUsuarioByIdForAdmin(id);
      
      // Extraer el plan desde suscripciones
      let tipoPlan = null;
      if (usuario?.suscripciones && Array.isArray(usuario.suscripciones) && usuario.suscripciones.length > 0) {
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
          tipoPlan = planMapping[planNombre] || suscripcion.plan.nombre;
        }
      }
      
      // Convertir rol de minúsculas (backend) a formato del select (mayúscula inicial)
      const usuarioFormateado = {
        ...usuario,
        rol: usuario.rol ? usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1).toLowerCase() : 'Usuario',
        tipoPlan: tipoPlan // Agregar el plan extraído
      };
      
      setViewUsuario(usuarioFormateado);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Error al obtener detalles:", err);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar los detalles del cliente.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  // Funcion para editar un cliente
  const handleEditar = async (id) => {
    try {
      const usuario = await usuarioService.getUsuarioByIdForAdmin(id);
      
      // Extraer el plan desde suscripciones
      let tipoPlan = null;
      if (usuario?.suscripciones && Array.isArray(usuario.suscripciones) && usuario.suscripciones.length > 0) {
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
          tipoPlan = planMapping[planNombre] || suscripcion.plan.nombre;
        }
      }
      
      // Convertir rol de minúsculas (backend) a formato del select (mayúscula inicial)
      const usuarioFormateado = {
        ...usuario,
        rol: usuario.rol ? usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1).toLowerCase() : 'Usuario',
        tipoPlan: tipoPlan // Agregar el plan extraído
      };
      setModalMode('edit');
      setSelectedUsuario(usuarioFormateado);
      setPlanOriginal(tipoPlan); // Guardar el plan original para comparar cambios
      setRutinaPendiente(undefined); // Resetear cambios pendientes al abrir
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error al obtener datos para editar:", err);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar los datos del cliente.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  // Funciones para gestionar rutinas (ahora solo actualizan el estado local)
  const handleEliminarRutina = () => {
    if (!selectedUsuario) return;
    
    Swal.fire({
      title: '¿Desvincular rutina?',
      text: 'La rutina se desvinculará cuando guardes los cambios. La rutina no se eliminará, solo se desvinculará del cliente.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desvincular',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setRutinaPendiente(null); // null significa desvincular
        setRutinaAction(null);
        // Actualizar el estado local para mostrar el cambio
        setSelectedUsuario({
          ...selectedUsuario,
          rutina_activa: null
        });
      }
    });
  };

  const handleCambiarRutina = (rutinaId) => {
    if (!selectedUsuario) return;
    
    // Buscar la rutina seleccionada
    const rutinaSeleccionada = rutinas.find(r => r.id_rutina === rutinaId);
    
    if (rutinaSeleccionada) {
      setRutinaPendiente(rutinaId);
      setRutinaAction(null);
      // Actualizar el estado local para mostrar el cambio
      setSelectedUsuario({
        ...selectedUsuario,
        rutina_activa: {
          id_rutina: rutinaSeleccionada.id_rutina,
          nombre: rutinaSeleccionada.nombre
        }
      });
    }
  };

  const handleRutinaCreada = (nuevaRutina) => {
    if (!selectedUsuario) return;
    
    // Guardar la nueva rutina en el estado pendiente
    setRutinaPendiente(nuevaRutina.id_rutina);
    setRutinaAction(null);
    setIsRutinaModalOpen(false);
    
    // Actualizar el estado local para mostrar el cambio
    setSelectedUsuario({
      ...selectedUsuario,
      rutina_activa: {
        id_rutina: nuevaRutina.id_rutina,
        nombre: nuevaRutina.nombre
      }
    });
    
    // Agregar la nueva rutina a la lista de rutinas
    setRutinas(prev => [...prev, nuevaRutina]);
    
    Swal.fire({
      title: 'Rutina creada',
      text: 'La rutina se asignará al cliente cuando guardes los cambios.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  };

  // Función auxiliar para obtener el id_plan desde el nombre del plan
  const obtenerIdPlanPorNombre = (nombrePlan) => {
    if (!nombrePlan || !planes || planes.length === 0) return null;
    
    // Mapear nombres del frontend a nombres del backend
    const planMapping = {
      'Basic': 'basic',
      'Standard': 'standard',
      'Premium': 'premium'
    };
    
    const nombreBackend = planMapping[nombrePlan] || nombrePlan.toLowerCase();
    const plan = planes.find(p => p.nombre && p.nombre.toLowerCase() === nombreBackend);
    return plan ? plan.id_plan : null;
  };

  // Funcion para actualizar un usuario
  const handleUpdateUsuario = async (id, usuarioData) => {
    try {
      const datosLimpios = limpiarDatosUsuario(usuarioData, 'edit');
      
      // Verificar si el plan cambió
      const planNuevo = usuarioData.tipoPlan;
      const planCambio = planNuevo && planNuevo !== planOriginal && planNuevo !== null;
      
      // Si hay cambios pendientes de rutina, incluirlos en los datos
      if (rutinaPendiente !== undefined) {
        datosLimpios.rutina_activa_id = rutinaPendiente;
      }
      
      console.log('Datos originales:', usuarioData);
      console.log('Datos limpios a enviar al backend:', datosLimpios);
      console.log('Plan original:', planOriginal, 'Plan nuevo:', planNuevo, '¿Cambió?', planCambio);
      
      // Si el plan cambió, mostrar confirmación y otorgar el nuevo plan manualmente
      if (planCambio) {
        const id_plan = obtenerIdPlanPorNombre(planNuevo);
        if (id_plan) {
          // Obtener el nombre del plan para mostrar en la alerta
          const planSeleccionado = planes.find(p => p.id_plan === id_plan);
          const nombrePlan = planSeleccionado ? getPlanLabel(planNuevo) : planNuevo;
          
          // Mostrar confirmación antes de otorgar el plan
          const confirmacion = await Swal.fire({
            title: '¿Otorgar suscripción?',
            html: `Se le otorgará una suscripción al plan <strong>${nombrePlan}</strong> al cliente.<br><br>
                   Esto cancelará cualquier suscripción activa anterior y activará el nuevo plan inmediatamente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, otorgar suscripción',
            cancelButtonText: 'Cancelar'
          });

          if (!confirmacion.isConfirmed) {
            // Si el usuario cancela, no continuar con la actualización
            return;
          }

          try {
            const resultado = await suscripcionService.otorgarPlanManual({
              id_usuario: id,
              id_plan: id_plan,
              mesesContratados: 1 // Por defecto 1 mes, se puede hacer configurable después
            });
            console.log('Plan otorgado manualmente:', resultado);
            // Recargar usuarios después de otorgar el plan para actualizar la tabla
            await cargarUsuarios();
          } catch (planError) {
            console.error("Error al otorgar plan:", planError);
            Swal.fire({
              title: 'Error al otorgar plan',
              text: planError?.response?.data?.message || planError?.message || 'Error al otorgar el plan al cliente',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
            throw planError;
          }
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo encontrar el plan seleccionado',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          throw new Error('Plan no encontrado');
        }
      }
      
      // Actualizar los demás datos del usuario
      await usuarioService.updateUsuario(id, datosLimpios);
      await cargarUsuarios();
      
      // Resetear el estado de rutina pendiente y plan original
      setRutinaPendiente(undefined);
      setPlanOriginal(null);
      
      Swal.fire({
        title: 'Cliente actualizado exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Error desconocido al actualizar el cliente';
      console.error("Detalles del error:", err?.response?.data);
      Swal.fire({
        title: 'Error al actualizar cliente',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      throw err;
    }
  };

  // Funcion para eliminar un cliente
  const handleEliminar = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Estás seguro de que deseas eliminar el cliente con ID ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await usuarioService.deleteUsuario(id);

          // Recargar local despues de eliminar
          setUsuarios(prevUsuarios =>
            prevUsuarios.filter(usuario =>
              (usuario.id_usuario || usuario.id) !== id
            )
          );

          // Recargar desde el servidor para asegurar consistencia
          await cargarUsuarios();

          Swal.fire({
            title: 'Cliente eliminado exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        } catch (err) {
          console.error("Error al eliminar usuario:", err);
          Swal.fire({
            title: 'Error',
            text: 'Error al eliminar el cliente. Por favor, intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          // Si falla, recargar para asegurar que el estado este sincronizado
          await cargarUsuarios();
        }
      }
    });
  };

  return (
    <>
      <Header />
      <div className="admin-content">
        <div className="container">
          <h1 className="admin-title">Administrar Clientes</h1>
          <AdminBar
            onClick={handleAddClick}
            placeholder={placeholder}
            showAddButton={false}
            onSearch={setSearchTerm}
            searchValue={searchTerm}
            contadores={contadoresClientes}
          />
          {error && (
            <div className="admin-error-message">
              {error}
            </div>
          )}
          <Tabla
            columns={columns}
            data={data}
            loading={loading}
            onVer={handleVerDetalles}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />
        </div>
      </div>

      <PopUpEdit
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRutinaAction(null);
          setRutinaPendiente(undefined); // Resetear cambios pendientes al cerrar
          setPlanOriginal(null); // Resetear plan original al cerrar
        }}
        mode={modalMode}
        initialData={selectedUsuario || {}}
        fields={camposUsuario}
        onSubmit={handleFormSubmit}
        entityName="cliente"
        title={modalMode === 'create' ? 'Agregar Nuevo Cliente' : 'Editar Cliente'}
        customContent={
          (modalMode === 'edit' || modalMode === 'view') && selectedUsuario ? (
            <div className="rutina-gestion-container">
              <h3 className="rutina-gestion-title">
                Gestión de Rutina
              </h3>
              
              {/* Mostrar rutina actual */}
              <div className="rutina-actual-container">
                <strong className="rutina-actual-label">Rutina Actual: </strong>
                {selectedUsuario?.rutina_activa ? (
                  <span className="rutina-actual-nombre">{selectedUsuario.rutina_activa.nombre || `Rutina #${selectedUsuario.rutina_activa.id_rutina}`}</span>
                ) : (
                  <span className="rutina-actual-sin">Sin rutina asignada</span>
                )}
              </div>

              {/* Botones de acción - Solo en modo editar */}
              {modalMode === 'edit' && (
                <>
                  <div className="rutina-actions-container">
                    {selectedUsuario?.rutina_activa && (
                      <button
                        type="button"
                        onClick={handleEliminarRutina}
                        className="rutina-btn rutina-btn-eliminar"
                      >
                        Desvincular Rutina
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => setRutinaAction(rutinaAction === 'cambiar' ? null : 'cambiar')}
                      className={`rutina-btn ${rutinaAction === 'cambiar' ? 'rutina-btn-cambiar-active' : 'rutina-btn-cambiar'}`}
                    >
                      {rutinaAction === 'cambiar' ? 'Cancelar' : 'Cambiar Rutina'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsRutinaModalOpen(true);
                        setRutinaAction('crear');
                      }}
                      className="rutina-btn rutina-btn-crear"
                    >
                      Crear Nueva Rutina
                    </button>
                  </div>

                  {/* Selector de rutina para cambiar */}
                  {rutinaAction === 'cambiar' && (
                    <div className="rutina-selector-container">
                      <label className="rutina-selector-label">
                        Seleccionar nueva rutina:
                      </label>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleCambiarRutina(parseInt(e.target.value));
                            e.target.value = '';
                          }
                        }}
                        className="rutina-selector-select"
                      >
                        <option value="">Seleccione una rutina...</option>
                        {rutinas
                          .filter(rutina => rutina.id_rutina !== selectedUsuario?.rutina_activa?.id_rutina)
                          .map(rutina => (
                            <option key={rutina.id_rutina} value={rutina.id_rutina}>
                              {rutina.nombre} {rutina.tipo_rutina === 'cliente' ? '(Cliente específico)' : rutina.tipo_rutina === 'plan' ? `(${rutina.categoria})` : '(General)'}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null
        }
      />

      <PopUpEdit
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        mode="view"
        initialData={viewUsuario || {}}
        fields={camposUsuarioView}
        onSubmit={() => { }} // No se usa en modo view
        entityName="cliente"
        title="Detalles del Cliente"
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        customContent={
          viewUsuario ? (
            <div className="rutina-gestion-container rutina-gestion-container-view">
              <h3 className="rutina-gestion-title">
                Gestión de Rutina
              </h3>
              
              {/* Mostrar rutina actual */}
              <div className="rutina-actual-container">
                <strong className="rutina-actual-label">Rutina Actual: </strong>
                {viewUsuario?.rutina_activa ? (
                  <span className="rutina-actual-nombre">{viewUsuario.rutina_activa.nombre || `Rutina #${viewUsuario.rutina_activa.id_rutina}`}</span>
                ) : (
                  <span className="rutina-actual-sin">Sin rutina asignada</span>
                )}
              </div>
            </div>
          ) : null
        }
      />

      {/* Modal para crear nueva rutina */}
      {isRutinaModalOpen && selectedUsuario && (
        <ModalCrearRutina
          isOpen={isRutinaModalOpen}
          onClose={() => {
            setIsRutinaModalOpen(false);
            setRutinaAction(null);
          }}
          onRutinaCreada={handleRutinaCreada}
          initialUsuarioId={selectedUsuario.id_usuario || selectedUsuario.id}
        />
      )}
    </>
  );
};

export default AdminClientes;

