import "./BotonRutina.css";

export default function BotonRutina({ texto, icono: Icono, tipo = "normal", onClick }) {
  return (
    <button
      className={`boton-rutina ${tipo === "nueva" ? "boton-nueva" : ""}`}
      onClick={onClick}
    >
      <span>{texto}</span>
      <Icono className="icono" />
    </button>
  );
}