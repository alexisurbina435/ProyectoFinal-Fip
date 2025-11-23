import { useState, useEffect, useMemo } from "react";
import Header from "../../components/header/Header"
import Tabla from "../../components/Tabla/Tabla"
import AdminBar from "../../components/AdminBar/AdminBar"
import ejercicioService from "../../services/ejercicio.service";
import PopUpEdit from "../../components/popUpEdit/PopUpEdit";
import { getEjercicioFields } from "../../components/popUpEdit/fields/ejercicioFields";

const AdminEjercicios = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedEjercicio, setSelectedEjercicio] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewEjercicio, setViewEjercicio] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar ejercicios al montar el componente
  useEffect(() => {
    cargarEjercicios();
  }, []);

  const cargarEjercicios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ejercicioService.getAllEjercicios();
      setEjercicios(response);
    } catch (err) {
      console.error("Error al cargar ejercicios:", err);
      setError("Error al cargar los ejercicios. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Transformar datos del backend al formato de la tabla
  const transformarDatos = (ejercicios) => {
    return ejercicios.map(ejercicio => ({
      id: ejercicio.id_ejercicio || ejercicio.id,
      nombre: ejercicio.nombre,
      descripcion: ejercicio.detalle || ejercicio.descripcion,
      imagen: ejercicio.img_url || ejercicio.imagen,
      video: ejercicio.video_url || ejercicio.video
    }));
  };

  // Filtrar datos segun el termino de busqueda
  const datosFiltrados = useMemo(() => {
    const datosTransformados = transformarDatos(ejercicios);
    
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
  }, [ejercicios, searchTerm]);

  const data = datosFiltrados;

  const columns = [
    { key: 'id', label: 'ID', sortable: true},
    { key: 'nombre', label: 'Nombre', sortable: true},
    { key: 'descripcion', label: 'Descripción', sortable: true},
    { key: 'imagen', label: 'Imagen', clickable: true },
    { key: 'video', label: 'Video', clickable: true }
  ];

  const placeholder = 'ejercicio';

  const camposEjercicio = useMemo(
    () => getEjercicioFields({ mode: modalMode }),
    [modalMode]
  );

  const camposEjercicioView = useMemo(
    () => getEjercicioFields({ mode: 'view' }),
    []
  );

  // Funcion para limpiar datos antes de enviar al backend
  const limpiarDatosEjercicio = (ejercicioData) => {
    const datosLimpios = { ...ejercicioData };
    
    // Eliminar campos que no deberian enviarse
    delete datosLimpios.id;
    delete datosLimpios.id_ejercicio;
    
    // Eliminar campos undefined o null
    Object.keys(datosLimpios).forEach(key => {
      if (datosLimpios[key] === undefined || datosLimpios[key] === null) {
        delete datosLimpios[key];
      }
    });
    
    return datosLimpios;
  };

  // Funcion para agregar nuevo ejercicio
  const handleAddClick = () => {
    setModalMode('create');
    setSelectedEjercicio(null);
    setIsModalOpen(true);
  };

  // Funcion para manejar el submit del formulario
  const handleFormSubmit = async (ejercicioData) => {
    try {
      if (modalMode === 'create') {
        const datosLimpios = limpiarDatosEjercicio(ejercicioData);
        console.log('Datos a enviar al backend (create):', datosLimpios);
        await ejercicioService.createEjercicio(datosLimpios);
        await cargarEjercicios();
        alert('Ejercicio creado exitosamente');
      } else {
        await handleUpdateEjercicio(selectedEjercicio.id_ejercicio || selectedEjercicio.id, ejercicioData);
      }
    } catch (err) {
      console.error("Error al procesar ejercicio:", err);
      throw err;
    }
  };

  // Funcion para ver detalles de un ejercicio
  const handleVerDetalles = async (id) => {
    try {
      const ejercicio = await ejercicioService.getEjercicioById(id);
      setViewEjercicio(ejercicio);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Error al obtener detalles:", err);
      alert('Error al cargar los detalles del ejercicio.');
    }
  };

  // Funcion para editar un ejercicio
  const handleEditar = async (id) => {
    try {
      const ejercicio = await ejercicioService.getEjercicioById(id);
      setModalMode('edit');
      setSelectedEjercicio(ejercicio);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error al obtener datos para editar:", err);
      alert('Error al cargar los datos del ejercicio.');
    }
  };

  // Funcion para actualizar un ejercicio
  const handleUpdateEjercicio = async (id, ejercicioData) => {
    try {
      const datosLimpios = limpiarDatosEjercicio(ejercicioData);
      console.log('Datos a enviar al backend:', datosLimpios);
      await ejercicioService.updateEjercicio(id, datosLimpios);
      await cargarEjercicios();
      alert('Ejercicio actualizado exitosamente');
    } catch (err) {
      console.error("Error al actualizar ejercicio:", err);
      alert('Error al actualizar el ejercicio. Por favor, intenta nuevamente.');
      throw err;
    }
  };

  // Funcion para eliminar un ejercicio
  const handleEliminar = async (id) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el ejercicio con ID ${id}?`)) {
      return;
    }

    try {
      await ejercicioService.deleteEjercicio(id);
      
      // Recargar local despues de eliminar
      setEjercicios(prevEjercicios => 
        prevEjercicios.filter(ejercicio => 
          (ejercicio.id_ejercicio || ejercicio.id) !== id
        )
      );
      
      // Recargar desde el servidor para asegurar consistencia
      await cargarEjercicios();
      
      alert('Ejercicio eliminado exitosamente');
    } catch (err) {
      console.error("Error al eliminar ejercicio:", err);
      alert('Error al eliminar el ejercicio. Por favor, intenta nuevamente.');
      // Si falla, recargar para asegurar que el estado este sincronizado
      await cargarEjercicios();
    }
  };

  return (
    <>
      <Header />
      <div className="admin-content">
        <div className="container">
          <h1 className="admin-title">Administrar Ejercicios</h1>
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
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />
        </div>
      </div>

      <PopUpEdit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedEjercicio || {}}
        fields={camposEjercicio}
        onSubmit={handleFormSubmit}
        entityName="ejercicio"
        title={modalMode === 'create' ? 'Agregar Nuevo Ejercicio' : 'Editar Ejercicio'}
      />

      <PopUpEdit
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        mode="view"
        initialData={viewEjercicio || {}}
        fields={camposEjercicioView}
        onSubmit={() => {}} // No se usa en modo view
        entityName="ejercicio"
        title="Detalles del Ejercicio"
      />
    </>
  );
};

export default AdminEjercicios;