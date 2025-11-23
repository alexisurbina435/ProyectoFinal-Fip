import FooterContact from "./FooterContact";
import FooterBrand from "./FooterBrand";
import FooterNav from "./FooterNav";
import FooterSocial from "./FooterSocial";
import FooterCopyright from "./FooterCopyright";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-gray-900 text-white py-10">
      <div className="footer-content max-w-6xl mx-auto px-6">
        <div className="footer-grid grid md:grid-cols-3 gap-8 items-center">
          <FooterContact />
          <FooterBrand />
          <FooterNav />
        </div>

        <div className="footer-line my-6 border-t border-gray-700"></div>

        <FooterSocial />
        <FooterCopyright />
      </div>
    </footer>
  );
};

export default Footer;