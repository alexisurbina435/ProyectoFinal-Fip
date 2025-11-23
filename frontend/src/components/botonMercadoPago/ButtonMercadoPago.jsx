import { Wallet } from "@mercadopago/sdk-react";
import { useEffect, useState, useRef } from "react";

export default function ButtonMercadoPago() {
  const [preferenceId, setPreferenceId] = useState(null);
  const lock = useRef(false);

  useEffect(() => {
    if (lock.current) return;
    lock.current = true;

    fetch("http://localhost:3000/api/mercadopago/crear-preferencia", {
      method: "POST",
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