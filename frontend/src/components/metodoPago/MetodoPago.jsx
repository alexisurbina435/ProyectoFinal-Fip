
// import CardTarjeta from "../card-Tarjetas/CardTarjeta.jsx";
import CardMetodoPago from "../card-metodoPago/CardMetodoPago.jsx";


import tarjetaVisa from "../../assets/tarjetaVisa.svg";
import tarjetaMastercard from "../../assets/tarjetaMastercard.svg";
import mercadoPago from "../../assets/mercadoPago.svg";
import ctaDni from "../../assets/ctaDni.svg";

import '../metodoPago/metodoPago.css';


function MetodoPago() {

    const transferencia = [{ imag: mercadoPago, alter: "mercado pago" }, { imag: ctaDni, alter: "cta dni" }]
    const tarjeta = [{ imag: tarjetaVisa, alter: "tarjeta visa" }, { imag: tarjetaMastercard, alter: "tarjeta mastercard" }]


    return (
        <>
            <h2 className="titulo-pago">Metodos de pago</h2>
            <div className="contenedor-pago">
                <CardMetodoPago title="Tarjeta de credito" metodos={tarjeta} clase="lista-tarjetas" />
                <CardMetodoPago title="Tarjeta de debito" metodos={tarjeta}  clase="lista-tarjetas"/>
                <CardMetodoPago title="Transferencia bancaria" metodos={transferencia} clase="metodos-pago-list" />
            </div>
        </>
    );
};

export default MetodoPago;
