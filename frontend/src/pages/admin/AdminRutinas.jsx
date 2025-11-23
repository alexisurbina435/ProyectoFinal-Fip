import Header from "../../components/header/Header"
import Tabla from "../../components/Tabla/Tabla"
import AdminBar from "../../components/AdminBar/AdminBar"

const AdminRutinas = () => {

  const data = [
        {
            id: 1,
            nombre: 'Rutina Principiante',
            descripcion: 'Rutina básica para personas que recién comienzan',
            nivel: 'Principiante',
            duracion: '4 semanas',
            ejercicios: 8 + " ejercicios",
            estado: 'Activo'
        },
        {
            id: 2,
            nombre: 'Rutina Intermedia',
            descripcion: 'Rutina para personas con experiencia moderada',
            nivel: 'Intermedio',
            duracion: '6 semanas',
            ejercicios: 12 + " ejercicios",
            estado: 'Activo'
        },
        {
            id: 3,
            nombre: 'Rutina Avanzada',
            descripcion: 'Rutina intensiva para atletas experimentados',
            nivel: 'Avanzado',
            duracion: '8 semanas',
            ejercicios: 15 + " ejercicios",
            estado: 'Activo'
        },
        {
            id: 4,
            nombre: 'Rutina de Recuperación',
            descripcion: 'Rutina suave para recuperación muscular',
            nivel: 'Todos los niveles',
            duracion: '2 semanas',
            ejercicios: 6 + " ejercicios",
            estado: 'Inactivo'
        }
    ];

    const columns = [
        { key: 'id', label: 'ID', sortable: true},
        { key: 'nombre', label: 'Nombre', sortable: true},
        { key: 'descripcion', label: 'Descripción', sortable: true},
        { key: 'nivel', label: 'Nivel', sortable: true},
        { key: 'duracion', label: 'Duración', sortable: true},
        { key: 'ejercicios', label: 'Ejercicios', sortable: true, clickable: true },
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
  

  const placeholder = 'rutina';

  const handleAddClick = () => {
    console.log('Agregar ' + placeholder);
  };

  return (
    <>
      <Header />
      <div className="admin-content">
        <div className="container">
          <h1 className="admin-title">Administrar Rutinas</h1>
          <AdminBar onClick={handleAddClick} placeholder={placeholder} />
          <Tabla columns={columns} data={data} />
        </div>
      </div>
    </>
  );
};

export default AdminRutinas;

