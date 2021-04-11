import "./Homepage.css";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Header from "../Header/Header";
import Home from "../Home/Home";
import About from "../../pages/about";
import Method from "../../pages/method";
import Savanna from "../../pages/savanna";
import AudioCall from "../../pages/audio";
import Sprint from "../../pages/sprint";
import Ourgame from "../../pages/ourgame";
import Rules from "../../pages/rules";
import Stats from "../../pages/stats";
import Ourteam from "../../pages/ourteam";
import Login from "../../pages/login";
import Signin from "../../pages/signin";
import Book from "../../pages/book";

function Homepage() {
  return (
    <div className="homepage">
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/aboutmethod" component={Method} />
        <Route path="/book" component={Book} />
        <Route path="/games/savanna" component={Savanna} />
        <Route path="/games/audiogame" component={AudioCall} />
        <Route path="/games/sprint" component={Sprint} />
        <Route path="/games/ourgame" component={Ourgame} />
        <Route path="/games/rules" component={Rules} />
        <Route path="/games/stats" component={Stats} />
        <Route path="/ourteam" component={Ourteam} />
        <Route path="/login" component={Login} />
        <Route path="/signin" component={Signin} />
        <Redirect to="/" />
      </Switch>
      {/* <Footer /> */}
    </div>
  );
}

export default Homepage;
