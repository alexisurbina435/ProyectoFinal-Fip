import { useState, useEffect, useMemo } from "react";
import Header from "../../components/header/Header"
import Tabla from "../../components/Tabla/Tabla"
import AdminBar from "../../components/AdminBar/AdminBar"
import rutinaService from "../../services/rutina.service.js";
import TablaRutina from "../../components/rutina/TablaRutina";

const AdminRutinas = () => {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRutina, setSelectedRutina] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
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

      return {
        id: rutina.id_rutina || rutina.id,
        nombre: nombreRutina,
        descripcion: rutina.descripcion || 'Sin descripción',
        nivel: rutina.nivel ? rutina.nivel.charAt(0).toUpperCase() + rutina.nivel.slice(1) : 'N/A',
        categoria: rutina.categoria || 'Sin plan',
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
  // TODO: Falta definir cómo se va a crear una rutina
  const handleAddClick = () => {
    // TODO: Implementar modal o vista para crear rutina:
    // - Seleccionar usuario o si es una rutina por defecto
    // - Definir nombre, descripción, nivel
    // - Asignar categoría (plan) si aplica
    // - Crear semanas, días y ejercicios
    console.log('Agregar ' + placeholder);
    alert('Funcionalidad de crear rutina pendiente de implementar');
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
        <div className="rutina-view-modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflow: 'auto'
        }}>
          <div style={{
            backgroundColor: 'var(--gris-osc)',
            borderRadius: '10px',
            padding: '30px',
            width: '95%',
            maxWidth: '1200px',
            maxHeight: '95vh',
            overflow: 'auto',
            border: '1px solid var(--naranja)',
            position: 'relative'
          }}>
            <button
              onClick={() => {
                setIsViewOpen(false);
                setSelectedRutina(null);
              }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'transparent',
                border: 'none',
                color: 'var(--blanco)',
                fontSize: '28px',
                cursor: 'pointer',
                padding: '5px 10px',
                zIndex: 10,
                fontWeight: 'bold'
              }}
            >
              ×
            </button>
            
            {/* Información adicional de la rutina */}
            <div style={{ marginBottom: '20px', color: 'var(--blanco)', paddingRight: '40px' }}>
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
    </>
  );
};

export default AdminRutinas;

