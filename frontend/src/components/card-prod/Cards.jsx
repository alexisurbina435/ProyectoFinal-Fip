import { useState, useEffect} from "react";
import CardPro from "./CardPro";
import "./Cards.css";
import ProductoService from "../../services/producto.service";

function Cards(){
     const [productos ,setProductos] = useState([]);
     const [loading , setLoading] = useState(true);
     const [error , setError] = useState (null);


     const GetProd = async () => {
       const productoData = await ProductoService.getAllProductos();
       setProductos(productoData);
     }
     useEffect(() => { 
        GetProd();
        
     }, []);

    


return (
    
        <section className="seccion-productos" id="listaProductos">
        <div className="sub-productos">
          <h1>Rinde al maximo,luce increible. Todo lo que necesites esta aquí.</h1>
        </div>
        {productos.length === 0 ? <p className="loading-prod">Cargando...</p> : 
        <div className="cards-container" id="productosContainer">
        {productos.map((prod)=>(
            <CardPro key={prod.id_producto} id={prod.id_producto} nombre={prod.nombre} precio={prod.precio} stock={prod.stock} descripcion={prod.descripcion} img={prod.imagen}></CardPro>
        ))}
        </div>
        }
        </section>
        
        

)
}
export default Cards;