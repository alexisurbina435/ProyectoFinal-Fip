import "./textarea.css"
import React from "react";
const Textarea = React.forwardRef((props,ref) => {
    return (
        <textarea className="form-textarea" ref={ref} {...props}></textarea>
    )
});


export default Textarea;
