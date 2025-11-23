import "./botonLogin.css";

export default function BotonForm(props) {
    return (
        <button {...props} > {props.children}</button>
    )
}