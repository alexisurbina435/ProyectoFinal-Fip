import { useCarrito } from "../context/CarritoContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ComprarAhoraButton({ producto, stock }) {
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

  const comprarAhora = () => {
    if (!checkLogin()) return;

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

  return <button onClick={comprarAhora}>Comprar ahora</button>;
}
