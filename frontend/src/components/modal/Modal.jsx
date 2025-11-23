import "./modal.css";

export default function Modal({mensaje}) {


    const closeBtn = ( (e) => {
        favDialog.close();
        setTimeout(() => { window.location.href = "/"; }, 600);
    });

    return (
        <div>
            <div className="overlay" id="overlay">
                <div className="overlay-block"></div>
            </div>
            <dialog id="favDialog">
                <div className="modal-container">
                    <p>{mensaje}.<br />Gracias por elegirnos</p>
                    <button id="closeModal" onClick={closeBtn}>Cerrar</button>
                </div>
            </dialog>
        </div>

    )
}