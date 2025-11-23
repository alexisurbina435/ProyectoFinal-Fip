import { useState, useEffect, useMemo } from "react";
import Header from "../../components/header/Header"
import Tabla from "../../components/Tabla/Tabla"
import AdminBar from "../../components/AdminBar/AdminBar"
import productoService from "../../services/producto.service.js";
import PopUpEdit from "../../components/popUpEdit/PopUpEdit";
import { getProductoFields } from "../../components/popUpEdit/fields/productoFields";

const AdminTienda = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewProducto, setViewProducto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productoService.getAllProductos();
      setProductos(response);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("Error al cargar los productos. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Transformar datos del backend al formato de la tabla
  const transformarDatos = (productos) => {
    return productos.map(producto => ({
      id: producto.id_producto || producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: typeof producto.precio === 'number' 
        ? `$${producto.precio.toFixed(2)}` 
        : producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
      imagen: producto.imagen,
      estado: producto.stock > 0 ? 'Activo' : 'Sin Stock'
    }));
  };

  // Filtrar datos según el término de búsqueda
  const datosFiltrados = useMemo(() => {
    const datosTransformados = transformarDatos(productos);
    
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
  }, [productos, searchTerm]);

  const data = datosFiltrados;

  const columns = [
    { key: 'id', label: 'ID', sortable: true, width: '80px'},
    { key: 'nombre', label: 'Nombre', sortable: true, width: '150px'},
    { key: 'descripcion', label: 'Descripción', sortable: true, width: '200px'},
    { key: 'precio', label: 'Precio', sortable: true, width: '100px'},
    { key: 'stock', label: 'Stock', sortable: true, width: '80px'},
    { key: 'categoria', label: 'Categoría', sortable: true, clickable: true, width: '120px' },
    { 
      key: 'imagen', 
      label: 'Imagen', 
      clickable: true,
      width: '120px',
      render: (value, row) => {
        if (!value) return <span style={{ color: '#999', fontSize: '0.85rem' }}>Sin imagen</span>;
        
        return (
          <div className="table-image-preview">
            <img 
              src={value} 
              alt={row.nombre || 'Producto'} 
              onError={(e) => {
                e.target.style.display = 'none';
                const errorSpan = e.target.nextElementSibling;
                if (errorSpan) errorSpan.style.display = 'inline';
              }}
              onClick={() => window.open(value, '_blank')}
              title="Click para ver imagen completa"
            />
            <span 
              style={{ 
                display: 'none', 
                color: '#999', 
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
              onClick={() => window.open(value, '_blank')}
            >
              Ver imagen
            </span>
          </div>
        );
      }
    },
    { 
      key: 'estado', 
      label: 'Estado', 
      sortable: true,
      width: '100px',
      render: (value) => {
        let colorClass = '';
        if (value === 'Activo') colorClass = 'status-activo';
        else if (value === 'Inactivo') colorClass = 'status-inactivo';
        else if (value === 'Pendiente') colorClass = 'status-pendiente';
        else if (value === 'Sin Stock') colorClass = 'status-inactivo';
        
        return <span className={`status-badge ${colorClass}`}>{value}</span>;
      }
    }
  ];

  const placeholder = 'producto';

  const camposProducto = useMemo(
    () => getProductoFields({ mode: modalMode }),
    [modalMode]
  );

  const camposProductoView = useMemo(
    () => getProductoFields({ mode: 'view' }),
    []
  );

  // Función para limpiar datos antes de enviar al backend
  const limpiarDatosProducto = (productoData, mode) => {
    const datosLimpios = { ...productoData };
    
    // Eliminar campos que no deberían enviarse
    delete datosLimpios.id;
    delete datosLimpios.id_producto;
    delete datosLimpios.estado;
    delete datosLimpios.fecha_creacion;
    
    // Convertir precio a número si viene como string con $
    if (typeof datosLimpios.precio === 'string') {
      datosLimpios.precio = parseFloat(datosLimpios.precio.replace('$', '').replace(',', ''));
    }
    
    // Convertir stock a número si viene como string
    if (typeof datosLimpios.stock === 'string') {
      datosLimpios.stock = parseInt(datosLimpios.stock, 10);
    }
    
    // Eliminar campos undefined o null
    Object.keys(datosLimpios).forEach(key => {
      if (datosLimpios[key] === undefined || datosLimpios[key] === null) {
        delete datosLimpios[key];
      }
    });
    
    return datosLimpios;
  };

  // Función para agregar nuevo producto
  const handleAddClick = () => {
    setModalMode('create');
    setSelectedProducto(null);
    setIsModalOpen(true);
  };

  // Función para manejar el submit del formulario
  const handleFormSubmit = async (productoData) => {
    try {
      if (modalMode === 'create') {
        const datosLimpios = limpiarDatosProducto(productoData, 'create');
        console.log('Datos a enviar al backend (create):', datosLimpios);
        await productoService.createProducto(datosLimpios);
        await cargarProductos();
        alert('Producto creado exitosamente');
        setIsModalOpen(false);
      } else {
        await handleUpdateProducto(selectedProducto.id_producto || selectedProducto.id, productoData);
      }
    } catch (err) {
      console.error("Error al procesar producto:", err);
      alert(err.response?.data?.message || 'Error al procesar el producto. Por favor, intenta nuevamente.');
      throw err; // Re-lanzar para que el componente maneje el error
    }
  };

  // Función para ver detalles de un producto
  const handleVerDetalles = async (id) => {
    try {
      const producto = await productoService.getProductoById(id);
      setViewProducto(producto);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Error al obtener detalles:", err);
      alert('Error al cargar los detalles del producto.');
    }
  };

  // Función para editar un producto
  const handleEditar = async (id) => {
    try {
      const producto = await productoService.getProductoById(id);
      setModalMode('edit');
      setSelectedProducto(producto);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error al obtener datos para editar:", err);
      alert('Error al cargar los datos del producto.');
    }
  };

  // Función para actualizar un producto
  const handleUpdateProducto = async (id, productoData) => {
    try {
      const datosLimpios = limpiarDatosProducto(productoData, 'edit');
      console.log('Datos a enviar al backend (update):', datosLimpios);
      await productoService.updateProducto(id, datosLimpios);
      await cargarProductos();
      alert('Producto actualizado exitosamente');
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      alert(err.response?.data?.message || 'Error al actualizar el producto. Por favor, intenta nuevamente.');
      throw err;
    }
  };

  // Función para eliminar un producto
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    try {
      await productoService.deleteProducto(id);
      
      // Recargar local después de eliminar
      setProductos(prevProductos => 
        prevProductos.filter(producto => 
          (producto.id_producto || producto.id) !== id
        )
      );
      
      // Recargar desde el servidor para asegurar consistencia
      await cargarProductos();
      
      alert('Producto eliminado exitosamente');
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert('Error al eliminar el producto. Por favor, intenta nuevamente.');
      // Si falla, recargar para asegurar que el estado esté sincronizado
      await cargarProductos();
    }
  };

  return (
    <>
      <Header />
      <div className="admin-content">
        <div className="container">
          <h1 className="admin-title">Administrar Tienda</h1>
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
        onSubmit={handleFormSubmit}
        fields={camposProducto}
        initialData={selectedProducto}
        mode={modalMode}
        entityName="producto"
      />

      <PopUpEdit
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        fields={camposProductoView}
        initialData={viewProducto}
        mode="view"
        entityName="producto"
      />
    </>
  );
};

export default AdminTienda;

