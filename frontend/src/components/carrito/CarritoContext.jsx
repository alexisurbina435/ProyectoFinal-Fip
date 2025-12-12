import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import CarritoService from "../../services/carrito.service";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (firstLoad) {
      const saved = JSON.parse(localStorage.getItem("carrito"));
      setCarrito(saved || []);

      setFirstLoad(false);
      return;
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito, firstLoad]);

  const cargarCarrito = (items) => {
    setCarrito(items ?? []);
  };

  const agregarAlCarrito = async (producto) => {
    setCarrito((prev) => {
      const index = prev.findIndex(
        (p) => (p.id_producto || p.id) === producto.id
      );

      if (index !== -1) {
        return prev.map((p, i) =>
          i === index ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const carritoId = JSON.parse(localStorage.getItem("carritoId"));

    if (usuario) {
      await CarritoService.addItem(carritoId, producto.id);
    }
  };
  const cambiarCantidad = async (id, delta) => {
    let nuevaCantidad = null;

    setCarrito((prev) =>
      prev.map((p) => {
        const pid = p.id_producto || p.id;

        if (pid !== id) return p;

        const nueva = p.cantidad + delta;
        if (nueva < 1) return p;

        nuevaCantidad = nueva;

        return { ...p, cantidad: nueva };
      })
    );

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const carritoId = JSON.parse(localStorage.getItem("carritoId"));

    setTimeout(async () => {
      if (usuario) {
        await CarritoService.updateCantidad(carritoId, id, nuevaCantidad);
      }
    }, 300);
  };

  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((p) => (p.id_producto || p.id) !== id));

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const carritoId = JSON.parse(localStorage.getItem("carritoId"));

    if (usuario) {
      CarritoService.deleteItem(carritoId, id);
    }
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
        cargarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
