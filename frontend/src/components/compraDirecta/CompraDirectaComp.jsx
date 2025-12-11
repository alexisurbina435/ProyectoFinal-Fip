import "./CompraDirecta.css";
import ButtonMercadoPago from "../botonMercadoPago/ButtonMercadoPago";
import { useCarrito } from "../carrito/CarritoContext";
import FormCarrito from "../formCarrito/FormCarrito";
import { useState } from "react";
const CompraDirectaComp = () => {
  const { carrito, totalCarrito } = useCarrito();
  const [metodoEnvio, setMetodoEnvio] = useState("");

  if (!carrito.length) {
    return (
      <div className="compraDirecta-content">
        <p>No hay productos para comprar.</p>
      </div>
    );
  }

  return (
    <div className="compraDirecta-content">

      <div className="carrito-content">

        {carrito.map((p) => (
          <div className="producto-item" key={p.id}>
            <img src={p.img} alt={p.descripcion} />

            <div>
              <h6>{p.nombre}</h6>
              <span>{p.descripcion}</span>
            </div>

            <div>$ {p.precio}</div>

            <div>Cantidad: {p.cantidad}</div>
          </div>
        ))}

        <div className="total-compra">
          <span>Total:</span>
          <span>$ {totalCarrito}</span>
        </div>
      </div>

      <div className="pago-content">
        <h3 className="metodo-carrito">Elegí método de pago:</h3>
        <select className="form-select mb-3">
          <option value="">Seleccioná una opción</option>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta crédito/débito</option>
          <option value="transferencia">Transferencia bancaria</option>
        </select>

        <h3 className="metodo-carrito">Elegí método de envío:</h3>
        <select
          className="form-select mb-3"
          value={metodoEnvio}
          onChange={(e) => setMetodoEnvio(e.target.value)}
        >
          <option value="">Seleccioná una opción</option>
          <option value="retiro">Retiro en tienda</option>
          <option value="domicilio">Envío a domicilio</option>
        </select>

        {metodoEnvio === "domicilio" && <FormCarrito />}

        <ButtonMercadoPago />
      </div>

    </div>
  );
};

export default CompraDirectaComp;
