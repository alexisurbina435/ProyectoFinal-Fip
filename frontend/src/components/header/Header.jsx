import Logo from "./Logo.jsx";
import NavLinks from "./NavLinks.jsx";
import CartButton from "./CartButton.jsx";
import Dropdown from "./Dropdown.jsx";
import "./header.css";
import usuarioService from "../../services/usuario.service";
import { useEffect, useState } from "react";

export default function Header() {

    const [user, setUser] = useState(null);

    const FetchUser = async () => {
        try {
            const usuario = await usuarioService.getCurrentUser();
            setUser(usuario);
        } catch (error) {
            // Si no hay usuario autenticado, setUser a null o objeto vacío
            setUser(null);
        }
    };


    useEffect(() => {
        FetchUser();
    }, [])
    return (
        <header className="header">
            <nav className="navigation">
                <Logo />
                <NavLinks />
                <div className="icons-container">
                    <CartButton />
                    {/* si usuario pago */}
                    {user && user.estado_pago === true ? (
                        <Dropdown options={["Perfil", "Blog", "Rutina", "Consulta", "Cerrar sesión"]} />
                        // si usuario no pago 
                    ) : user && user.rol === "usuario" && user.estado_pago === false ? (
                        <Dropdown options={["Perfil", "Blog", "Cerrar sesión"]} />
                        //usuario es admin 
                    ) : user && user.rol === "admin" ? (
                        <Dropdown options={["Panel administrador","Perfil", "Blog", "Cerrar sesión"]} />
                    ) : (
                        <Dropdown options={["Acceder", "Crear cuenta"]} />
                    )}
                </div>
            </nav>
        </header>
    );
}