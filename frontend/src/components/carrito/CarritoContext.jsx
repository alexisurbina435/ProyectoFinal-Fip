import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (firstLoad) {
      const saved = JSON.parse(localStorage.getItem("carrito"));
      setCarrito(saved ?? []);   
      setFirstLoad(false);
      return;
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito, firstLoad]);   

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const index = prev.findIndex((p) => p.id === producto.id);

      if (index !== -1) {
        const nuevo = prev.map((p, i) =>
          i === index ? { ...p, cantidad: p.cantidad + 1 } : p
        );
        return nuevo;   
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        const nueva = p.cantidad + delta;

        if (nueva < 1) return p;
        if (nueva > p.stock) {
          Swal.fire({
            icon: "warning",
            title: "Sin stock",
            text: "No hay más stock disponible",
            confirmButtonColor: "#ee5f0d",
          });
          return p;
        }

        return { ...p, cantidad: nueva };
      })
    );
  };

  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const totalCarrito = carrito.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const cantidadTotal = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        cambiarCantidad,
        eliminarProducto,
        totalCarrito,
        cantidadTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
