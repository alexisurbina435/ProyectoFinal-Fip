import "./label.css"
export default function Label(props) {
    return (
        <div className="label-form" {...props} >{props.children}</div>
    )
}