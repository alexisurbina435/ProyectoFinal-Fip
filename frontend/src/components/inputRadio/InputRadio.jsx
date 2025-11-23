import "./inputRadio.css"
import React from "react";

const InputRadio = React.forwardRef((props,ref) =>{

    return (

        <input type="radio" ref={ref} {...props} />

    )
})
export default InputRadio;
