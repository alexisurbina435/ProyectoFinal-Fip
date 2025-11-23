import "./botonForm.css";

export default function BotonForm(props) {
    return (
        <button className="form-button" {...props} > {props.children}</button>
    )
}