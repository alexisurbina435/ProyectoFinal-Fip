import Header from "../../components/header/Header"
import Footer from "../../components/footer/Footer"
import TablaBackend from "../../components/tablaBackend/TablaBackend"
import { useState, useEffect } from "react";
import ContactoService from "../../services/contacto.service";
import { useAuth } from "../../context/AuthProvider";
const AdminContacto = () => {

    const { user } = useAuth();
    const [consulta, setConsulta] = useState([]);
    const [loading, setLoading] = useState(true);

    const consultas = async (consulta) => {
        try {
            setLoading(true);
            const contacto = await ContactoService.getAllContactos(consulta);
            setConsulta(contacto);
        } catch (error) {
            console.error("Error al cargar consultas:", error);
            setConsulta([]);
        } finally {
            setLoading(false);
        }
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
                    <TablaBackend columns={columnas} data={consulta} loading={loading} />
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
