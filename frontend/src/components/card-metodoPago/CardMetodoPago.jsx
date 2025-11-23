
import './cardMetodoPago.css';
import Tarjeta from "../Tarjetas/Tarjeta";
export default function CardMetodoPago({ title, metodos, clase }) {

   
    return (

        <div>
            <div className="contenedor-tarjetas">
                <h3 className="metodos-pago">{title}</h3>
                <ul className={clase}>
                    {metodos.map((metodo, index) => (
                        <li key={index}>
                            <Tarjeta imag={metodo.imag} alter={metodo.alter} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}