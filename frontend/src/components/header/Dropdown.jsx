import { useState } from "react";
import "./dropdown.css";
import {Link, useNavigate} from "react-router-dom";
import authService from "../../services/auth.service.js";

const Dropdown = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [user, setUser] = useState([]);
   const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = async (option) => {
    setSelected(option);
    setIsOpen(false);

    if (option === "Cerrar sesión") {
      try{
        await authService.logout();
        setUser(null)
      }catch(error){
        console.log(error);
      }
      navigate("/");
      window.location.reload();
    }
  };
  const routes = {
  Perfil: "/perfil",
  Blog: "/blog",
  "Panel administrador": "/admin",
  Rutina: "/rutina",
  Acceder: "/login",
  "Crear cuenta": "/registro",
  Consulta: "/consulta",
  "Cerrar sesion": "/logout",
};

  return (
    <div className="dropdown">
      <div
        className={`select ${isOpen ? "select-clicked" : ""}`}
        onClick={toggleDropdown}
      >
        <i className="fa-regular fa-user icon"></i>
        <div className={`caret ${isOpen ? "caret-rotate" : ""}`} />
      </div>

      <ul className={`menu ${isOpen ? "menu-open" : ""}`}>
        {options.map((option, i) => (
          <li
            key={i}
            className={selected === option ? "active" : ""}
            onClick={() => handleSelect(option)}
          >
            {routes[option] ? (
            <Link
            to={routes[option]}
            className="login-links"
            onClick={()=>setIsOpen(false)}
            >
              {option}
            </Link>
            ) : (
              <span className="login-links">{option}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;