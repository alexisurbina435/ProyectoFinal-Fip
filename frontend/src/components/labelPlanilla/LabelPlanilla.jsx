import "./LabelPlanilla.css";

export default function LabelPlanilla(props) {
    return (
        <div className="label-planilla" {...props}>
            {props.children}
        </div>
    );
}