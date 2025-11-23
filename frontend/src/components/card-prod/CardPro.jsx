import Boton from "../botones/Boton";
import "./CardPro.css";



function CardPro({nombre,precio,stock,descripcion,img}){

    return(
        
        <article className="card-producto">
        <div className="card">
        <div>
        <span className="stock">Stock disponible {stock}</span>
        <img decoding="async" src={img} className="img-prod" alt={descripcion}></img>
        </div>
         <div className="detalle-pro">
          <h2 className="producto-nombre">{nombre}</h2>
          <p className="descripcion-pro">{descripcion}</p>
          <p className="precio"><span>$</span>{precio}</p>
          </div>
          <div className="botones">
          <Boton clase="comprarAhora" texto="Comprar Ahora" onClick={() => console.log("Comprando")}></Boton>
          <Boton clase="agregarCarrito" texto="Agregar al Carrito" onClick={()=>console.log("agregando al carrito")}></Boton>
         </div>
         </div>
         </article>
        


    )
}
export default CardPro;