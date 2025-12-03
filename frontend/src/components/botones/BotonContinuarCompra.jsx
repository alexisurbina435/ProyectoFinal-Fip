import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export default function BotonContinuar() {
    const navigate = useNavigate();

    const handleClick = () => {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        // No logueado → pedir login
        if (!usuario) {
            Swal.fire({
                title: "Necesitás iniciar sesión",
                text: "Para continuar con la compra, primero iniciá sesión.",
                icon: "warning",
                confirmButtonText: "Ir a iniciar sesión",
                confirmButtonColor: "#ee5f0d",
            }).then(() => {
                navigate("/login");
            });
            return;
            }

        // Logueado → enviar a compraDirecta
        navigate("/compraDirecta");
        };

        return (
            <button className="continuar-compra" onClick={handleClick}>
                Continuar Compra
            </button>
        );
    }