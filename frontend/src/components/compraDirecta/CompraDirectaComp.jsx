import "./CompraDirecta.css";
import ButtonMercadoPago from "../botonMercadoPago/ButtonMercadoPago";

const CompraDirectaComp = () => {
    return (
        <>
            <div className="compraDirecta-content">
                <div className="carrito-content" id="detalleCompra"></div>
                <div className="pago-content" id="pagoContent">
                    <ButtonMercadoPago />
                </div>
            </div>
        </>
    );
};

export default CompraDirectaComp;