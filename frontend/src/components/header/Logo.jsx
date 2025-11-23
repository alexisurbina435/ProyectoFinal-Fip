import { Link } from "react-router-dom";
import logoImg from '../../assets/images/logo-sinfondo.png';

export default function Logo() {
    return(
        <Link to="/" className="logo-link">
            <img src={logoImg} alt="logo" className="logo" />
        </Link>
    );
}