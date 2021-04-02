import React from "react";
import { Container } from "react-bootstrap";
import "../styles/sprint.css";
import sprint from "../assets/images/sprint.jpg";
import parrot_1 from "../assets/icons/parrot1.svg";
import parrot_2 from "../assets/icons/parrot2.svg";
import parrot_3 from "../assets/icons/parrot3.svg";
import parrot_4 from "../assets/icons/parrot4.svg";

function Sprint() {
  return (
    <div>
      <Container>
        <div className="sprint__content">
          <h2 className="sprint__title">СПРИНТ</h2>

          <div className="sprint__bg">
            <div className="game__timer">
              <p> Время</p>
              <p className="timer__counter" id="timer__counter">
                60
              </p>
            </div>
            <div className="sprint__game-card">
              <div className="game__card-title"></div>
              <div className="game__card-vector"></div>
              <button className="btn__true">Верно</button>
              <button className="btn__false">Неверно</button>
            </div>

            <div className="game__result" id="game__result">
              <p>Результат</p>
              <p className="result__counter" id="result__counter">
                0
              </p>
            </div>
            <img alt="sprint" src={sprint} className="sprint__bg" />
            <div className="parrot__container">
              <div className="parrot__1" id="parrot__1">
                <img alt="parrot_1" src={parrot_1} className="parrot__1-img" />
              </div>
              <div className="parrot__2" id="parrot__2">
                <img alt="parrot_2" src={parrot_2} className="parrot__2-img" />
              </div>
              <div className="parrot__3" id="parrot__3">
                <img alt="parrot_3" src={parrot_3} className="parrot__3-img" />
              </div>
              <div className="parrot__4" id="parrot__4">
                <img alt="parrot_4" src={parrot_4} className="parrot__4-img" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Sprint;
