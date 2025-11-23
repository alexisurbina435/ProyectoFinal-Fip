import React, { useState } from "react";
import "./TablaRutina.css";

export default function TablaRutina() {
  const [calentamiento, setCalentamiento] = useState("CALENTAMIENTO");
  const [semana, setSemana] = useState("SEMANA 1");

  const ejercicios = [
    { nombre: "Plancha con toques de hombro", series: 12, rep: 2 },
    { nombre: "Sentadillas con brazos al frente", series: 12, rep: 2 },
    { nombre: "Puente de glúteo", series: 12, rep: 2 },
    { nombre: "Talones al glúteo en el lugar", series: 12, rep: 2 },
    { nombre: "Plancha frontal", series: 12, rep: 2 },
    { nombre: "Círculos de cadera", series: 12, rep: 2 },
  ];

  return (
    <div className="tabla-contenedor">
      <div className="tabla-header">
        <h2>MI RUTINA</h2>
        <div className="tabla-opciones">
          <select
            value={calentamiento}
            onChange={(e) => setCalentamiento(e.target.value)}
          >
            <option value="CALENTAMIENTO">CALENTAMIENTO</option>
            {[...Array(5)].map((_, i) => (
              <option key={i} value={`DÍA ${i + 1}`}>
                DÍA {i + 1}
              </option>
            ))}
          </select>

          <select
            value={semana}
            onChange={(e) => setSemana(e.target.value)}
          >
            {[...Array(4)].map((_, i) => (
              <option key={i} value={`SEMANA ${i + 1}`}>
                SEMANA {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="tabla-rutina">
        <thead>
          <tr>
            <th>EJERCICIO</th>
            <th>SERIES</th>
            <th>REP</th>
            <th>Img. Ej.</th>
            <th>Vid. Ej.</th>
          </tr>
        </thead>
        <tbody>
          {ejercicios.map((e, i) => (
            <tr key={i}>
              <td>{e.nombre}</td>
              <td>{e.series}</td>
              <td>{e.rep}</td>
              <td className="link">Ver Imagen</td>
              <td className="link">Ver Video</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
