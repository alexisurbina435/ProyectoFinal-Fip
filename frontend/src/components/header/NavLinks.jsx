import { Link } from "react-router-dom";
export default function navlinks() {
    return (
        <ul className="nav-list">
            <li>
                <Link to="/" className="nav-links">Inicio</Link>
            </li>
            <li>
                <Link to="/productos" className="nav-links">Productos</Link>
            </li>
            <li>
                <Link to="/contacto" className="nav-links">Contacto</Link>
            </li>
            <li>
                <Link to="/inscribite" className="nav-links nav-inscribite">¡Inscribite ya!</Link>
            </li>
        </ul>
    );
}