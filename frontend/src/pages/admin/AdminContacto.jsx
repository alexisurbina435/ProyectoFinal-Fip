import Header from "../../components/header/Header"
import Footer from "../../components/footer/Footer"
import TablaBackend from "../../components/tablaBackend/TablaBackend"
import { useState, useEffect } from "react";
import ContactoService from "../../services/contacto.service";
import { useAuth } from "../../context/AuthProvider";
const AdminContacto = () => {

    const { user } = useAuth();
    const [consulta, setConsulta] = useState([]);

    const consultas = async (consulta) => {
        const contacto = await ContactoService.getAllContactos(consulta);
        setConsulta(contacto);
    }

    useEffect(() => {
        consultas();
    }, []);

    const columnas = consulta.length ? Object.keys(consulta[0]) : [];

    return (
        <>
            {user.rol === "admin" ? (
                <>
            <Header />
            <div className="admin-content">
                <div className="container">
                    <h1 className="admin-title">Administrar Consultas</h1>
                    <TablaBackend columns={columnas} data={consulta} />
                </div>
            </div>
            <Footer />
                </>
                ):(
                    <>
                    <h1>Acceso Denegado</h1>
                    </>
                )
            }
        </>
    );
};

export default AdminContacto;
