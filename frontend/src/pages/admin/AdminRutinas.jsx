import { useState, useEffect, useMemo } from "react";
import Header from "../../components/header/Header"
import Tabla from "../../components/Tabla/Tabla"
import AdminBar from "../../components/AdminBar/AdminBar"
import rutinaService from "../../services/rutina.service.js";
import TablaRutina from "../../components/rutina/TablaRutina";
import ModalCrearRutina from "../../components/rutina/ModalCrearRutina";
import Swal from 'sweetalert2';
import { SwalWithHighZIndex } from '../../components/rutina/utils/swalConfig';
import "./admin.css";

const AdminRutinas = () => {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRutina, setSelectedRutina] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar rutinas al montar el componente
  useEffect(() => {
    cargarRutinas();
  }, []);

  const cargarRutinas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await rutinaService.getAllRutinas();
      setRutinas(response);
    } catch (err) {
      console.error("Error al cargar rutinas:", err);
      setError("Error al cargar las rutinas. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Transformar datos del backend al formato de la tabla
  const transformarDatos = (rutinas) => {
    return rutinas.map(rutina => {
      // El nombre de la rutina
      let nombreRutina = rutina.nombre || 'Sin nombre';

      // Determinar qué mostrar en la columna categoría según el tipo de rutina
      let categoriaDisplay = 'Sin plan';
      
      if (rutina.tipo_rutina === 'general') {
        categoriaDisplay = 'Uso general';
      } else if (rutina.tipo_rutina === 'plan' && rutina.categoria) {
        // Para rutinas de plan, mostrar la categoría (Basic, Medium, Premium)
        categoriaDisplay = rutina.categoria;
      } else if (rutina.tipo_rutina === 'cliente') {
        // Para rutinas de cliente específico, mostrar tipo (el usuario se asigna a través de rutina_activa)
        categoriaDisplay = 'Cliente específico';
      }

      return {
        id: rutina.id_rutina || rutina.id,
        nombre: nombreRutina,
        descripcion: rutina.descripcion || 'Sin descripción',
        nivel: rutina.nivel ? rutina.nivel.charAt(0).toUpperCase() + rutina.nivel.slice(1) : 'N/A',
        categoria: categoriaDisplay,
      };
    });
  };

  // Filtrar datos según el término de búsqueda
  const datosFiltrados = useMemo(() => {
    const datosTransformados = transformarDatos(rutinas);
    
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
  }, [rutinas, searchTerm]);

  const data = datosFiltrados;

  const columns = [
    { key: 'id', label: 'ID', sortable: true, width: '80px'},
    { 
      key: 'nombre', 
      label: 'Nombre de la rutina', 
      sortable: true, 
      width: '200px'
    },
    { key: 'descripcion', label: 'Descripción', sortable: true, width: '250px'},
    { key: 'nivel', label: 'Nivel', sortable: true, width: '120px'},
    { key: 'categoria', label: 'Categoría', sortable: true, width: '120px'},
  ];

  const placeholder = 'rutina';

  // Función para manejar agregar rutina
  const handleAddClick = () => {
    setIsCreateModalOpen(true);
  };

  // Función para manejar rutina creada
  const handleRutinaCreada = (nuevaRutina) => {
    // Recargar lista de rutinas
    cargarRutinas();
    // Opcional: abrir la vista de la nueva rutina
    // setSelectedRutina(nuevaRutina);
    // setIsViewOpen(true);
  };

  // Función para ver detalles de una rutina
  const handleVerDetalles = async (id) => {
    try {
      const rutina = await rutinaService.getRutinaById(id);
      setSelectedRutina(rutina);
      setIsViewOpen(true);
    } catch (err) {
      console.error("Error al obtener detalles:", err);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar los detalles de la rutina.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ff6a00'
      });
    }
  };

  // Función para eliminar una rutina
  const handleEliminar = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar rutina?',
      text: '¿Estás seguro de que deseas eliminar esta rutina? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    try {
      await rutinaService.deleteRutina(id);
      
      // Recargar local después de eliminar
      setRutinas(prevRutinas => 
        prevRutinas.filter(rutina => 
          (rutina.id_rutina || rutina.id) !== id
        )
      );
      
      // Recargar desde el servidor para asegurar consistencia
      await cargarRutinas();
      
      Swal.fire({
        title: 'Éxito',
        text: 'Rutina eliminada exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ff6a00'
      });
    } catch (err) {
      console.error("Error al eliminar rutina:", err);
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al eliminar la rutina. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ff6a00'
      });
      // Si falla, recargar para asegurar que el estado esté sincronizado
      await cargarRutinas();
    }
  };

  // Función para manejar la eliminación desde el modal de TablaRutina
  const handleEliminarDesdeModal = async (id) => {
    // Usar SwalWithHighZIndex cuando el modal está abierto para que las alertas aparezcan por encima
    const SwalToUse = isViewOpen ? SwalWithHighZIndex : Swal;
    
    try {
      await rutinaService.deleteRutina(id);
      
      // Cerrar el modal
      setIsViewOpen(false);
      setSelectedRutina(null);
      
      // Recargar lista de rutinas (siempre, incluso si hay error parcial)
      await cargarRutinas();
      
      SwalToUse.fire({
        title: 'Éxito',
        text: 'Rutina eliminada exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ff6a00'
      });
    } catch (err) {
      console.error("Error al eliminar rutina:", err);
      
      // Cerrar el modal y recargar lista incluso si hay error
      setIsViewOpen(false);
      setSelectedRutina(null);
      await cargarRutinas();
      
      SwalToUse.fire({
        title: 'Error',
        text: err.response?.data?.message || err.message || 'Error al eliminar la rutina. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ff6a00'
      });
    }
  };

  return (
    <>
      <Header />
      <div className="admin-content">
        <div className="container">
          <h1 className="admin-title">Administrar Rutinas</h1>
          <AdminBar
            onClick={handleAddClick}
            placeholder={placeholder}
            onSearch={setSearchTerm}
            searchValue={searchTerm}
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
            onEliminar={handleEliminar}
          />
        </div>
      </div>

      {/* Vista de detalles de rutina con TablaRutina */}
      {isViewOpen && selectedRutina && (
        <div className="rutina-view-modal" onClick={() => {
                setIsViewOpen(false);
                setSelectedRutina(null);
        }}>
          <div className="rutina-view-content" onClick={(e) => e.stopPropagation()}>
            <TablaRutina 
              rutinaProp={selectedRutina}
              modoEdicion={true}
              isModal={true}
              onClose={() => {
                setIsViewOpen(false);
                setSelectedRutina(null);
              }}
              onRutinaActualizada={(rutinaActualizada) => {
                setSelectedRutina(rutinaActualizada);
                // Recargar lista de rutinas para reflejar cambios
                cargarRutinas();
              }}
              onEliminarRutina={handleEliminarDesdeModal}
            />
          </div>
        </div>
      )}

      {/* Modal para crear rutina */}
      <ModalCrearRutina
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRutinaCreada={handleRutinaCreada}
      />
    </>
  );
};

export default AdminRutinas;

