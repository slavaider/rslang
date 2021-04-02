import React from "react";
import { Container } from "react-bootstrap";
import "../styles/savanna.css";
import savannah from "../assets/images/savannah.jpg";
import heart from "../assets/icons/heart.svg";

function Savanna() {
  return (
    <div>
      <Container>
        <div className="savanna__content">
          <div className="savanna__bg">
            <h2 className="savanna__title">САВАННА</h2>

            <div className="heart__container">
              <img
                alt="heart_1"
                src={heart}
                className="heart__img"
                id="heart_1"
              />
              <img
                alt="heart_2"
                src={heart}
                className="heart__img"
                id="heart_2"
              />
              <img
                alt="heart_3"
                src={heart}
                className="heart__img"
                id="heart_3"
              />
              <img
                alt="heart_4"
                src={heart}
                className="heart__img"
                id="heart_4"
              />
              <img
                alt="heart_5"
                src={heart}
                className="heart__img"
                id="heart_5"
              />
            </div>
            <div className="btn__container">
              <button className="btn__savanna correct " id="btn__savanna-1">
                1.слово
              </button>
              <button className="btn__savanna  uncorrect" id="btn__savanna-2">
                2.слово
              </button>
              <button className="btn__savanna " id="btn__savanna-3">
                3.слово
              </button>
              <button className="btn__savanna " id="btn__savanna-4">
                4.слово
              </button>
            </div>
				<div className="bar__result"></div>
            <img alt="savanna" src={savannah} className="savanna__bg" />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Savanna;
