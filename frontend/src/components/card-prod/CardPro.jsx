import { useNavigate } from "react-router-dom";
import { useCarrito } from "../carrito/CarritoContext";
import Swal from "sweetalert2";
import Boton from "../botones/Boton";
import "./CardPro.css";

function CardPro({ id, nombre, precio, stock, descripcion, img }) {
  const { agregarAlCarrito } = useCarrito();  
  const navigate = useNavigate();

  const producto = { id, nombre, precio, stock, descripcion, img };

  const comprarAhora = () => {
    if (stock <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin stock",
        text: "No hay stock disponible",
        confirmButtonColor: "#ee5f0d",
      });
      return;
    }

    localStorage.setItem("compraDirecta", JSON.stringify(producto));
    agregarAlCarrito(producto);
    navigate("/compraDirecta");
  };

  const agregar = () => {
    if (stock <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin stock",
        text: "No hay stock disponible",
        confirmButtonColor: "#ee5f0d",
      });
      return;
    }

    agregarAlCarrito(producto);

    Swal.fire({
      icon: "success",
      title: "Producto agregado",
      showConfirmButton: false,
      timer: 1300,
    });
  };

  return (
    <article className="card-producto">
      <div className="card">
        <div>
          <span className="stock">Stock disponible {stock}</span>
          <img src={img} className="img-prod" alt={descripcion} />
        </div>

        <div className="detalle-pro">
          <h2 className="producto-nombre">{nombre}</h2>
          <p className="descripcion-pro">{descripcion}</p>
          <p className="precio">
            <span>$</span> {precio}
          </p>
        </div>

        <div className="botones">
          <Boton clase="comprarAhora" texto="Comprar Ahora" onClick={comprarAhora} />
          <Boton clase="agregarCarrito" texto="Agregar al Carrito" onClick={agregar} />
        </div>
      </div>
    </article>
  );
}

export default CardPro;