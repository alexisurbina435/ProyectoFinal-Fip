import { useState, useEffect, useMemo } from "react";
import Header from "../../components/header/Header"
import Tabla from "../../components/Tabla/Tabla"
import AdminBar from "../../components/AdminBar/AdminBar"
import usuarioService from "../../services/usuario.service";
import PopUpEdit from "../../components/popUpEdit/PopUpEdit";
import { getUsuarioFields, getPlanLabel } from "../../components/popUpEdit/fields/usuarioFields";

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

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

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
    return usuarios.map(usuario => ({
      id: usuario.id_usuario || usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      plan: getPlanLabel(usuario.tipoPlan),
      estado: usuario.estado_pago ? 'Activo' : 'Inactivo'
    }));
  };

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
        { key: 'id', label: 'ID', sortable: true},
        { key: 'nombre', label: 'Nombre', sortable: true},
        { key: 'apellido', label: 'Apellido', sortable: true},
        { key: 'email', label: 'Email', sortable: true},
        { key: 'telefono', label: 'Teléfono', sortable: false},
        { key: 'plan', label: 'Plan', sortable: true, clickable: true },
        { 
            key: 'estado', 
            label: 'Estado', 
            sortable: true, 
            render: (value) => {
                let colorClass = '';
                if (value === 'Activo') colorClass = 'status-activo';
                else if (value === 'Inactivo') colorClass = 'status-inactivo';
                else if (value === 'Pendiente') colorClass = 'status-pendiente';
                
                return <span className={`status-badge ${colorClass}`}>{value}</span>;
            }
        }
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
    
    // En modo edit, eliminar password si esta vacio
    if (mode === 'edit' && (!datosLimpios.password || datosLimpios.password.trim() === '')) {
      delete datosLimpios.password;
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
        alert('Cliente creado exitosamente');
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
      const usuario = await usuarioService.getUsuarioById(id);
      setViewUsuario(usuario);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Error al obtener detalles:", err);
      alert('Error al cargar los detalles del cliente.');
    }
  };

  // Funcion para editar un cliente
  const handleEditar = async (id) => {
    try {
      const usuario = await usuarioService.getUsuarioById(id);
      setModalMode('edit');
      setSelectedUsuario(usuario);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error al obtener datos para editar:", err);
      alert('Error al cargar los datos del cliente.');
    }
  };

  // Funcion para actualizar un usuario
  const handleUpdateUsuario = async (id, usuarioData) => {
    try {
      const datosLimpios = limpiarDatosUsuario(usuarioData, 'edit');
      console.log('Datos a enviar al backend:', datosLimpios);
      await usuarioService.updateUsuario(id, datosLimpios);
      await cargarUsuarios();
      alert('Cliente actualizado exitosamente');
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      alert('Error al actualizar el cliente. Por favor, intenta nuevamente.');
      throw err;
    }
  };

  // Funcion para eliminar un cliente
  const handleEliminar = async (id) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el cliente con ID ${id}?`)) {
      return;
    }

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
      
      alert('Cliente eliminado exitosamente');
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert('Error al eliminar el cliente. Por favor, intenta nuevamente.');
      // Si falla, recargar para asegurar que el estado este sincronizado
      await cargarUsuarios();
    }
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
        initialData={selectedUsuario || {}}
        fields={camposUsuario}
        onSubmit={handleFormSubmit}
        entityName="cliente"
        title={modalMode === 'create' ? 'Agregar Nuevo Cliente' : 'Editar Cliente'}
      />

      <PopUpEdit
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        mode="view"
        initialData={viewUsuario || {}}
        fields={camposUsuarioView}
        onSubmit={() => {}} // No se usa en modo view
        entityName="cliente"
        title="Detalles del Cliente"
      />
    </>
  );
};

export default AdminClientes;

