import { Wallet } from "@mercadopago/sdk-react";
import { useEffect, useState, useRef } from "react";

export default function ButtonMercadoPago() {
  const [preferenceId, setPreferenceId] = useState(null);
  const lock = useRef(false);

  useEffect(() => {
    if (lock.current) return;
    lock.current = true;

    // Leer carrito desde localStorage
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Convertir al formato de Mercado Pago
    const items = carrito.map((p) => ({
      title: p.nombre,
      description: p.descripcion,
      picture_url: p.img,
      quantity: p.cantidad,
      unit_price: Number(p.precio),
    }));

    fetch("https://proyectofinal-backend-7797.onrender.com/mercadopago/crear-preferencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    })
      .then((res) => res.json())
      .then((data) => {
        setPreferenceId(data.id);
      })
      .catch((err) => console.error("Error MP:", err));
  }, []);

  return (
    <div>
      {preferenceId && (
        <Wallet initialization={{ preferenceId }} />
      )}
    </div>
  );
}