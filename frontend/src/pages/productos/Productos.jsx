import Header from "../../components/header/Header";
import Banner from "../../components/banner/Banner";
import Cards from "../../components/card-prod/Cards";
import Footer from "../../components/footer/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Productos = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");

    
    if (status === "approved") {
      localStorage.removeItem("carrito");
      localStorage.removeItem("carritoId");
      window.history.replaceState({}, "", "/productos");
    }
  }, [location]);

  return (
    <>
      {/*Header*/}
      <Header />

      {/*Banner*/}
      <Banner />

      {/*Cards*/}
      <Cards />

      {/*Footer*/}
      <Footer />
    </>
  );
};

export default Productos;