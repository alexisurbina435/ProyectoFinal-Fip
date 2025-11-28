import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./Carrusel.css";
import ProductoService from "../../services/producto.service";
import { useCarrito } from "../carrito/CarritoContext"; // <-- importamos el contexto

const Carrusel = () => {
  const [productos, setProductos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

 
  const { agregarAlCarrito } = useCarrito();

  
  const cargarProductos = async () => {
    try {
      const productoData = await ProductoService.getAllProductos();
      setProductos(productoData);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  const getVisibleCount = () => {
    const width = window.innerWidth;
    if (width <= 480) return 2;
    if (width <= 600) return 2;
    if (width <= 768) return 3;
    if (width <= 900) return 3;
    return 4;
  };

  const updateVisibleCount = () => {
    const newVisibleCount = getVisibleCount();
    if (newVisibleCount !== visibleCount) {
      setVisibleCount(newVisibleCount);
    }
  };

  
  const handleAddToCart = (producto) => {
    const p = {
      id: producto.id_producto,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      descripcion: producto.descripcion,
      img: producto.imagen,
    };

    if (p.stock <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin stock",
        text: "No hay stock disponible",
        confirmButtonColor: "#ee5f0d",
      });
      return;
    }

    agregarAlCarrito(p);

    Swal.fire({
      icon: "success",
      title: "¡Producto agregado!",
      showConfirmButton: false,
      timer: 1300,
    });
  };

  const handleBuyNow = (producto) => {
    const p = {
      id: producto.id_producto,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      descripcion: producto.descripcion,
      img: producto.imagen,
    };

    if (p.stock <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin stock",
        text: "No hay stock disponible",
        confirmButtonColor: "#ee5f0d",
      });
      return;
    }

    
    localStorage.setItem("compraDirecta", JSON.stringify(p));
    agregarAlCarrito(p);
    window.location.href = "/compraDirecta";
  };

  const handleShowProduct = (producto) => {
    setSelectedProduct(producto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const navigateLeft = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setStartIndex((prev) => (prev - 1 + productos.length) % productos.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const navigateRight = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setStartIndex((prev) => (prev + 1) % productos.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const getVisibleProducts = () => {
    const visibleProducts = [];
    for (let i = 0; i < visibleCount; i++) {
      const idx = (startIndex + i) % productos.length;
      visibleProducts.push(productos[idx]);
    }
    return visibleProducts;
  };

  if (productos.length === 0) {
    return (
      <section className="carrusel-productos-container">
        <div style={{ textAlign: "center", color: "#ee5f0d", padding: "2rem" }}>
          <p>Error al cargar los productos</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="carrusel-productos-container">
        <button
          className="carrusel-arrow left"
          aria-label="Anterior"
          onClick={navigateLeft}
        >
          &#10094;
        </button>

        <div
          className="carrusel-productos"
          style={{
            opacity: isTransitioning ? 0.7 : 1,
            transform: isTransitioning ? "translateX(20px)" : "translateX(0)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {getVisibleProducts().map((producto) => (
            <div key={producto.id_producto} className="carrusel-producto">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="carrusel-producto-img"
                onClick={() => handleShowProduct(producto)}
              />
              <h4 className="carrusel-producto-nombre">{producto.nombre}</h4>
              <p className="carrusel-producto-precio">${producto.precio}</p>
              <div className="carrusel-botones">
                <button
                  className="comprarAhora"
                  onClick={() => handleBuyNow(producto)}
                >
                  Comprar Ahora
                </button>
                <button
                  className="agregarCarrito"
                  onClick={() => handleAddToCart(producto)}
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="carrusel-arrow right"
          aria-label="Siguiente"
          onClick={navigateRight}
        >
          &#10095;
        </button>
      </section>

      {showModal && selectedProduct && (
        <div
          id="popup-producto"
          className="modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="producto-detail"
            onClick={(e) => e.stopPropagation()}
          >
            <button id="cerrar-popup-producto" onClick={handleCloseModal}>
              &times;
            </button>
            <div className="producto-container">
              <div className="product-images">
                <img
                  src={selectedProduct.imagen}
                  alt={selectedProduct.nombre}
                  className="product-main-image"
                />
              </div>
              <div className="product-info">
                <h1 className="product-title">{selectedProduct.nombre}</h1>
                <div className="product-rating">
                  <span className="rating-number">4.7</span>
                  <span className="rating-stars">&#9733;&#9733;&#9733;&#9733;</span>
                </div>
                <div className="product-price">
                  <span>${selectedProduct.precio}</span>
                </div>
                <div className="stock-status">
                  Stock disponible: {selectedProduct.stock}
                </div>
                <button
                  className="comprarAhora"
                  onClick={() => {
                    handleBuyNow(selectedProduct);
                    handleCloseModal();
                  }}
                >
                  Comprar Ahora
                </button>
                <button
                  className="agregarCarrito"
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    handleCloseModal();
                  }}
                >
                  Agregar al Carrito
                </button>
                <div className="product-description">
                  <h2>Descripción</h2>
                  <div className="description-box">
                    {selectedProduct.descripcion}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Carrusel;
