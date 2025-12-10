import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    console.log(firstLoad);
    if (firstLoad) {
      const saved = JSON.parse(localStorage.getItem("carrito"));
      setCarrito(saved || []);
      console.log(carrito);
      setFirstLoad(false);
      return;
    }
    console.log(carrito);


    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito, firstLoad]);

  const cargarCarrito = (items) => {
    setCarrito(items ?? []);
  };

  const agregarAlCarrito = async (producto) => {
    setCarrito((prev) => {
      const index = prev.findIndex((p) => (p.id_producto || p.id) === producto.id);

      if (index !== -1) {
        return prev.map((p, i) =>
          i === index ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (usuario) {
      await carritoService.addItem(usuario.id_usuario, producto.id);
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

    if (nuevaCantidad !== null) {
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      if (usuario) {
        await carritoService.actualizarCantidad(
          usuario.id_usuario,
          id,
          nuevaCantidad
        );
      }
    }
  };

  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((p) => (p.id_producto || p.id) !== id));
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
