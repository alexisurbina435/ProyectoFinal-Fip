
import '../Tarjetas/Tarjeta.css';

import Icons from "../iconos/Icons";

function Tarjeta({ imag, alter }) {
    return (
        <div>
            <li>
                <Icons src={imag} alt={alter} />
            </li>
            
        </div>

    )
}
export default Tarjeta;