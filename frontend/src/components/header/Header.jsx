import Logo from "./Logo.jsx";
import NavLinks from "./NavLinks.jsx";
import CartButton from "./CartButton.jsx";
import Dropdown from "./Dropdown.jsx";
import "./header.css";
import usuarioService from "../../services/usuario.service";
import { useEffect, useState } from "react";

export default function Header() {

    const [user, setUser] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const FetchUser = async () => {
        const usuario = await usuarioService.getUsuarioById();
        setUser(usuario);
    };

    useEffect(() => {
        FetchUser();
    }, []);

    //detectar cambio de tamaño
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navLinksOptions = ["Inicio", "Productos", "Contacto", "¡Inscribite ya!"];

    let userOptions = [];

    if (user && user.rol === "admin") {
        userOptions = ["Panel administrador", "Perfil", "Blog", "Cerrar sesión"];
    } else if (user && user.estado_pago === true) {
        userOptions = ["Perfil", "Blog", "Rutina", "Consulta", "Cerrar sesión"];
    } else if (user && user.rol === "usuario" && user.estado_pago === false) {
        userOptions = ["Perfil", "Blog", "Cerrar sesión"];
    } else {
        userOptions = ["Acceder", "Crear cuenta"];
    }

    const dropdownOptions = isMobile
        ? [...navLinksOptions, ...userOptions]
        : userOptions;

    return (
        <header className="header">
            <nav className="navigation">
                <Logo />

                {/* Si no es mobile mostramos los navlinks normales */}
                {!isMobile && <NavLinks />}

                <div className="icons-container">
                    <CartButton />
                    <Dropdown options={dropdownOptions} />
                </div>
            </nav>
        </header>
    );
}