import './Homepage.css'
import React from 'react'
import {Redirect, Switch} from "react-router-dom";

function Homepage() {
    return (
        <div className="Homepage">

            <Switch>

                <Redirect to="/"/>
            </Switch>

        </div>
    );
}

export default Homepage;
