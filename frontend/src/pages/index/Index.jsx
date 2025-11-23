import Banner from "../../components/banner/Banner";
import Carrusel from "../../components/Carrusel/Carrusel";
import Header from "../../components/header/Header";
import Inscripcion from "../../components/inscripcion/Inscripcion";
import Footer from "../../components/footer/Footer";
import bannerRemeras from "../../assets/images/remeras.jpg";

const Index = () => {
  return (
    <>
      {/* Header */}
      <Header />

      { /* Banner */}
      <Banner />

      {/* TEXTO ILUSTRATIVO */}
      <section className="texto-container">
        <h3>
          Rinde al maximo, luce increible. Todo lo que necesitas esta aqui
        </h3>
      </section>
      
      {/* Carrusel */}
      <Carrusel />

      {/* Inscripcion */}
      <Inscripcion />

      {/* Seccion remeras */}
    <section className="seccion-remeras">
      <div className="descripcion-remera">
        <div>
          <h2 className="entrena">Entrena con estilo. Viste la fuerza de Superarse Gym</h2>
          <img src={bannerRemeras} alt="banner remeras" className="banner-remeras" />
        </div>
      </div>
    </section>
    {/* Fin seccion-remeras */}

      {/* Footer */}
      <Footer />

    </>
  )
}

export default Index;