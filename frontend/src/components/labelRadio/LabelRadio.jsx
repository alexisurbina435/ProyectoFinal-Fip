import "./labelRadio.css";

export default function LabelRadio(props) {
    return (
        <div className="label-radio" {...props}>
            {props.children}
        </div>
    );
}