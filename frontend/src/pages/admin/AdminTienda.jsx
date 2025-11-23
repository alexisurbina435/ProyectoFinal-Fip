import Header from "../../components/header/Header"
import Tabla from "../../components/Tabla/Tabla"
import AdminBar from "../../components/AdminBar/AdminBar"

const AdminTienda = () => {

  const data = [
        {
            id: 1,
            nombre: 'Proteína Whey',
            descripcion: 'Proteína de suero de leche de alta calidad',
            precio: '$15.99',
            stock: 45,
            categoria: 'Suplementos',
            imagen: 'proteina-whey.jpg',
            estado: 'Activo'
        },
        {
            id: 2,
            nombre: 'Cinturón de Gimnasio',
            descripcion: 'Cinturón de cuero para levantamiento de pesas',
            precio: '$29.99',
            stock: 12,
            categoria: 'Equipamiento',
            imagen: 'cinturon-gimnasio.jpg',
            estado: 'Activo'
        },
        {
            id: 3,
            nombre: 'Botella de Agua',
            descripcion: 'Botella deportiva de 1L con boquilla',
            precio: '$12.99',
            stock: 78,
            categoria: 'Accesorios',
            imagen: 'botella-agua.jpg',
            estado: 'Activo'
        },
        {
            id: 4,
            nombre: 'Creatina Monohidratada',
            descripcion: 'Creatina pura para ganancia de fuerza',
            precio: '$18.99',
            stock: 23,
            categoria: 'Suplementos',
            imagen: 'creatina.jpg',
            estado: 'Activo'
        },
        {
            id: 5,
            nombre: 'Guantes de Gimnasio',
            descripcion: 'Guantes con protección para callos',
            precio: '$24.99',
            stock: 0,
            categoria: 'Equipamiento',
            imagen: 'guantes-gimnasio.jpg',
            estado: 'Sin Stock'
        }
    ];

    const columns = [
        { key: 'id', label: 'ID', sortable: true},
        { key: 'nombre', label: 'Nombre', sortable: true},
        { key: 'descripcion', label: 'Descripción', sortable: true},
        { key: 'precio', label: 'Precio', sortable: true},
        { key: 'stock', label: 'Stock', sortable: true},
        { key: 'categoria', label: 'Categoría', sortable: true, clickable: true },
        { key: 'imagen', label: 'Imagen', clickable: true },
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
  

  const placeholder = 'producto';

  const handleAddClick = () => {
    console.log('Agregar ' + placeholder);
  };

  return (
    <>
      <Header />
      <div className="admin-content">
        <div className="container">
          <h1 className="admin-title">Administrar Tienda</h1>
          <AdminBar onClick={handleAddClick} placeholder={placeholder} />
          <Tabla columns={columns} data={data} />
        </div>
      </div>
    </>
  );
};

export default AdminTienda;

