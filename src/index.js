import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// Redux
import root_reducer from "./store/root";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import Homepage from "./components/Homepage/Homepage";
import "bootstrap/dist/css/bootstrap.min.css";

const store = new createStore(root_reducer, applyMiddleware(thunk));

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Homepage />
        
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
