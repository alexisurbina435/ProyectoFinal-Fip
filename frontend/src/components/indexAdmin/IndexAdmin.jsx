import "./indexAdmin.css";
import CardAdmin from "../cardAdmin/CardAdmin";
import { useNavigate } from "react-router-dom";

export default function IndexAdmin(){
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    }

    return (
        
        <section className="admin-content">
            <div className="container">
                <h1 className="admin-title">Panel de Administración</h1>
                <div className="admin-options">
                    <CardAdmin titulo="Administrar Clientes" descripcion="Gestionar información de clientes y usuarios" onClick={() => handleNavigate('/administrar-clientes')} />
                    <CardAdmin titulo="Administrar Rutinas" descripcion="Crear y modificar rutinas de entrenamiento" onClick={() => handleNavigate('/administrar-rutinas')} />
                    <CardAdmin titulo="Administrar Ejercicios" descripcion="Gestionar catálogo de ejercicios" onClick={() => handleNavigate('/administrar-ejercicios')} />
                    <CardAdmin titulo="Administrar Tienda" descripcion="Gestionar productos y ventas" onClick={() => handleNavigate('/administrar-tienda')} />
                    <CardAdmin titulo="Administrar Consultas" descripcion="Gestionar consultas y respuestas" onClick={() => handleNavigate('/adminContacto')} />
                </div>
            </div>
        </section>
    )
}