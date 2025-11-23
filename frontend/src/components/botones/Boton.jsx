import "./Boton.css";


function Boton ({texto, onClick, clase}){
    return(
        <>
        <div className="botones">
        <button className={clase} onClick={onClick}>
        {texto}
        </button>
        </div>
        
        </>
    )
}
export default Boton;

