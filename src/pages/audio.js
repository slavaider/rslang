import React from "react";
import { Container } from "react-bootstrap";
import "../styles/audiocall.css";
import phones from "../assets/icons/phones.svg";
import speaker from "../assets/icons/speaker.svg";

function AudioCall() {
  return (
    <div>
      <Container>
        <div className="audiocall__content">
          <h2 className="audiocall__title">АУДИОВЫЗОВ</h2>
          <img alt="speaker" src={speaker} className="speaker__img" />
          <div className="audiocall__word">
            <p id="word">Слово</p>
            <p id="str">Предложение</p>
          </div>

          <div className="btn__container-audiocall">
            <button className="btn__audiocall correct " id="btn__audiocall-1">
              1.слово
            </button>
            <button className="btn__audiocall correct " id="btn__audiocall-2">
              2.слово
            </button>
            <button className="btn__audiocall correct " id="btn__audiocall-3">
              3.слово
            </button>
            <button className="btn__audiocall correct " id="btn__audiocall-4">
              4.слово
            </button>
            <button className="btn__audiocall correct " id="btn__audiocall-5">
              5.слово
            </button>
          </div>
          <div className="audiocall__result"></div>
          <button className="btn__answer">Не знаю</button>
          <img alt="audiocall" src={phones} className="audiocall__bg" />
        </div>
      </Container>
    </div>
  );
}

export default AudioCall;
