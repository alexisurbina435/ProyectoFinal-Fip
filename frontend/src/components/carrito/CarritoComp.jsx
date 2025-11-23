import "./Carrito.css"; 
import { Link } from "react-router-dom";

const CarritoComponent = () => {
  return (
    <div className="carrito">
      <section className="carrito-content" id="carritoContainer"></section>

      <section className="carrito-resumen" id="carrito-resumen">
        <div className="resumen-text">
          <h5>Resumen de compra</h5>
        </div>

        <div className="resumen-list">
          <div className="productos-envio">
            <div className="productos">
              <span>Productos</span>
              <span id="precioResumen"></span>
            </div>
            <div className="envio">
              <span>Envío</span>
              <span>$$$</span>
            </div>
          </div>

          <div className="descuento-total">
            <div className="descuento">
              <span>Descuento</span>
              <span><span>$</span></span>
            </div>
            <div className="total">
              <span>Total</span>
              <span id="totalResumen"></span>
            </div>
          </div>

          
          <Link to="/compraDirecta"><button className="continuar-compra">Continuar Compra</button></Link>
          
        </div>
      </section>
    </div>
  );
};

export default CarritoComponent;
