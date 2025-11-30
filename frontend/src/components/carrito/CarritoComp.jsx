import "./Carrito.css";
import { Link } from "react-router-dom";
import { useCarrito } from "./CarritoContext";

const CarritoComponent = () => {
  const {
    carrito,
    cambiarCantidad,
    eliminarProducto,
    totalCarrito,
  } = useCarrito();

  if (!carrito.length) {
    return (
      <div className="carrito">
        <section className="carrito-content">
          <p>No hay productos en el carrito</p>
          <Link to="/productos">
            <button className="continuar-compra">Seguir comprando</button>
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="carrito">
      <section className="carrito-content">

        {carrito.map((p) => (
          <div className="producto-item" key={p.id || p.id_item || p.id_producto}>
            <img src={p.img} alt={p.descripcion} />

            <div>
              <h6>{p.nombre}</h6>
              <span>{p.descripcion}</span>
            </div>

            <div>
              <span className="precio-carrito">$ {p.precio}</span>
            </div>

            <div>
              <div>
                <button
                  className="restar"
                  disabled={p.cantidad === 1}
                  onClick={() => cambiarCantidad(p.id_producto || p.id, -1)}
                >
                  -
                </button>

                <input
                  type="number"
                  value={p.cantidad}
                  readOnly
                  className="input-cantidad"
                />

                <button
                  className="sumar"
                  disabled={p.cantidad === p.stock}
                  onClick={() => cambiarCantidad(p.id_producto || p.id, 1)}
                >
                  +
                </button>
              </div>

              <button
                className="eliminar"
                onClick={() => eliminarProducto(p.id_producto || p.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

      </section>

      <section className="carrito-resumen">
        <div className="resumen-text">
          <h5>Resumen de compra</h5>
        </div>

        <div className="resumen-list">

          <div className="productos-envio">
            <div className="productos">
              <span>Productos</span>
              <span>$ {totalCarrito}</span>
            </div>

            <div className="envio">
              <span>Envío</span>
              <span>$$$</span>
            </div>
          </div>

          <div className="descuento-total">
            <div className="descuento">
              <span>Descuento</span>
              <span>$ 0</span>
            </div>

            <div className="total">
              <span>Total</span>
              <span>$ {totalCarrito}</span>
            </div>
          </div>

          <Link to="/compraDirecta">
            <button className="continuar-compra">Continuar Compra</button>
          </Link>

        </div>
      </section>
    </div>
  );
};

export default CarritoComponent;
