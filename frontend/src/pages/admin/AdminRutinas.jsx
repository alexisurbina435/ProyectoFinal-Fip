import { useState, useEffect, useMemo } from "react";
import Header from "../../components/header/Header"
import Tabla from "../../components/Tabla/Tabla"
import AdminBar from "../../components/AdminBar/AdminBar"
import rutinaService from "../../services/rutina.service.js";
import TablaRutina from "../../components/rutina/TablaRutina";
import ModalCrearRutina from "../../components/rutina/ModalCrearRutina";
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
      // El nombre puede ser el nombre de la rutina o el nombre del cliente
      let nombreRutina = rutina.nombre;
      if (!nombreRutina && rutina.usuario) {
        nombreRutina = `${rutina.usuario.nombre || ''} ${rutina.usuario.apellido || ''}`.trim();
      }
      if (!nombreRutina) {
        nombreRutina = 'Sin nombre';
      }

      // Determinar qué mostrar en la columna categoría según el tipo de rutina
      let categoriaDisplay = 'Sin plan';
      
      if (rutina.tipo_rutina === 'general') {
        categoriaDisplay = 'Uso general';
      } else if (rutina.tipo_rutina === 'plan' && rutina.categoria) {
        // Para rutinas de plan, mostrar la categoría (Basic, Medium, Premium)
        categoriaDisplay = rutina.categoria;
      } else if (rutina.tipo_rutina === 'cliente' && rutina.usuario) {
        // Para rutinas de cliente específico, mostrar el nombre del cliente
        categoriaDisplay = `${rutina.usuario.nombre || ''} ${rutina.usuario.apellido || ''}`.trim() || 'Cliente sin nombre';
      } else if (rutina.tipo_rutina === 'cliente') {
        // Si es para cliente pero no hay datos del usuario
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
      alert('Error al cargar los detalles de la rutina.');
    }
  };

  // Función para eliminar una rutina
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta rutina?')) {
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
      
      alert('Rutina eliminada exitosamente');
    } catch (err) {
      console.error("Error al eliminar rutina:", err);
      alert('Error al eliminar la rutina. Por favor, intenta nuevamente.');
      // Si falla, recargar para asegurar que el estado esté sincronizado
      await cargarRutinas();
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
        <div className="rutina-view-modal">
          <div className="rutina-view-content">
            <button
              onClick={() => {
                setIsViewOpen(false);
                setSelectedRutina(null);
              }}
              className="rutina-view-close-btn"
            >
              ×
            </button>
            
            {/* Información adicional de la rutina */}
            <div className="rutina-view-info">
              <p><strong>Nivel:</strong> {selectedRutina.nivel ? selectedRutina.nivel.charAt(0).toUpperCase() + selectedRutina.nivel.slice(1) : 'N/A'}</p>
              <p><strong>Categoría:</strong> {selectedRutina.categoria || 'Sin plan'}</p>
              {selectedRutina.usuario && (
                <p><strong>Cliente:</strong> {selectedRutina.usuario.nombre} {selectedRutina.usuario.apellido}</p>
              )}
            </div>

            {/* Componente TablaRutina con modo edición */}
            <TablaRutina 
              rutinaProp={selectedRutina}
              modoEdicion={true}
              onRutinaActualizada={(rutinaActualizada) => {
                setSelectedRutina(rutinaActualizada);
                // Recargar lista de rutinas para reflejar cambios
                cargarRutinas();
              }}
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

