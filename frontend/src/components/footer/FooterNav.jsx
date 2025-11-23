import { Link, useLocation } from "react-router-dom";
const FooterNav = () => {
  const { pathname } = useLocation();

  const goTop = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="footer-nav">
      <ul className="footer-nav-list">
        <li><Link to="/" onClick={goTop} className="footer-nav-link">Inicio</Link></li>
        <li><Link to="/productos" onClick={goTop} className="footer-nav-link">Productos</Link></li>
        {/* <li><Link to="#planes" onClick={goTop} className="footer-nav-link">Planes</Link></li> */}
        <li><Link to="/inscribite" onClick={goTop} className="footer-nav-link">Inscribite</Link></li>
        <li><Link to="/contacto" onClick={goTop} className="footer-nav-link">Contacto</Link></li>
      </ul>
    </nav>
  );
};

export default FooterNav;