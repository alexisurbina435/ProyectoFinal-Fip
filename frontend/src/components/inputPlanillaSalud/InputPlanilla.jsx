import "./inputPlanilla.css"
import React from "react";

const LabelInputPlanilla = React.forwardRef((props, ref) => {
    return (
        <input ref={ref} {...props} />
    )

})

export default LabelInputPlanilla;
