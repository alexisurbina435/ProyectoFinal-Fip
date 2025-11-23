
import "./cardInscripcion.css"
import { useState } from "react"
import BtnInscribite from "../botonInscribete/BtnInscribite.jsx"

export default function CardInscripcion({ plan, precio, beneficio, clase, mostrarBotonInicial= true }) {
const [mostrarBoton,setMostrarBoton] = useState(mostrarBotonInicial)

const handleClick =()=>{
  setMostrarBoton(false)
}
  return (
    <>
      
      <div className={`contenedor-inscripcion ${clase}`}>
        <div className="plan">
          <h1 className="descripcion">{plan}</h1>
          <h3 className="descripcion precio">{precio}</h3>
        </div>
        <div className="beneficios">
          <ul className="lista-beneficios">
            {beneficio.map((bene, index) => (
              <li key={index}>{bene}</li>
            ))}
          </ul>
          {(mostrarBoton &&
          <BtnInscribite onClick={handleClick} plan={plan} precio={precio} beneficio={beneficio} clase={clase}/>
          )}
          </div>
      </div>
    </>
  )
}
