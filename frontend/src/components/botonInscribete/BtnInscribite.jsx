import "./btnInscribite.css";
import { Link } from "react-router-dom";

export default function BtnInscribite({plan,precio,beneficio, onClick}) {

    
    return (
        <Link to="/inscripciondetalle" state={{ plan, precio, beneficio }}>
         <button className="btn-inscripcion" onClick={onClick}>¡Inscribite!</button>
        </Link>
    )
}