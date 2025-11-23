import { useLocation } from "react-router-dom";
import "./blogDetalle.css";

export default function BlogDetalle() {
  const location = useLocation();
  const data = location.state; // los datos que vienen desde Link

  if (!data) {
    return <p>No se encontró información del blog.</p>;
  }

  const { img, category, titulo, glosario, contenido } = data;

  return (
    <div className="element-card">
      <h1 className="title">{titulo}</h1>

      <img src={img} alt={titulo} className="imagen-detalle" />

      <div className="contenedor">
        <div className="card-glosario">
          <h3>{glosario}</h3>
        </div>
        <div className="cards-grande">
          <p>{contenido}</p>
        </div>
        <div className="cards">
          <h4>{category}</h4>
        </div>
        </div>
        </div>
    
  );
}