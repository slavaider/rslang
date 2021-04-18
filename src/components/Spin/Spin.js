import React from "react";
import {Spinner} from "react-bootstrap";

function Spin() {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: 374}}>
            <Spinner size="lg" animation="border" variant="primary"/>
        </div>
    )
}

export default Spin
