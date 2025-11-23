import BotonRutina from "../botones/BotonRutina";
import { ArrowRight } from "lucide-react";
import { Plus } from "lucide-react";
import "./rutina.css";

const Rutina = () => {
    return (
            <div className="contenedor">
                <h1>Mis Rutinas</h1>
                <div className="fila">
                    <BotonRutina texto="Rutina 1" icono={ArrowRight} />
                    <BotonRutina texto="Rutina 2" icono={ArrowRight} />
                </div>

                <BotonRutina texto="Nueva Rutina" icono={Plus} tipo="nueva" />
            </div>
    );
};

export default Rutina;