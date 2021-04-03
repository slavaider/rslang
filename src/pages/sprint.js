import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import "../styles/sprint.css";
import sprint from "../assets/images/sprint.jpg";
import parrot_1 from "../assets/icons/parrot1.svg";
import parrot_2 from "../assets/icons/parrot2.svg";
import parrot_3 from "../assets/icons/parrot3.svg";
import parrot_4 from "../assets/icons/parrot4.svg";
import errorSound from "../assets/sounds/error.mp3";
import okSound from "../assets/sounds/ok.mp3";
import errorImg from "../assets/icons/error.svg";
import okImg from "../assets/icons/ok.svg";

function Sprint() {
  const wordsEasy = [
    {
      en: "about",
      ru: "о",
    },
    {
      en: "address",
      ru: "адрес",
    },
    {
      en: "always",
      ru: "всегда",
    },
    {
      en: "arrive",
      ru: "приезжать",
    },
    {
      en: "bank",
      ru: "банк",
    },
  ];

  const wordsEng = wordsEasy.map((el, ind) => el.en);
  const wordsRu = wordsEasy.map((el, ind) => el.ru);
  const start = document.querySelector(".btn__start");
  const gameBody = document.querySelector(".game__body");
  const ok = document.getElementById("ok__img");
  const error = document.getElementById("error__img");
  const points = 10;

  const [timer, setTimer] = useState(20);
  const [timerOn, setTimerOn] = useState(false);
  const [result, setResult] = useState(0);
  const [wordEng, setWordEng] = useState(
    wordsEng[Math.floor(Math.random() * wordsEng.length)]
  );
  const [wordRu, setWordRu] = useState(
    wordsRu[Math.floor(Math.random() * wordsRu.length)]
  );

  useEffect(() => {
    let interval = null;
    if (timerOn) {
      start.style.visibility = "hidden";
      gameBody.style.visibility = "visible";
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (!timerOn) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  useEffect(() => {
    if (timer === 0) {
      start.style.visibility = "visible";
      setTimerOn(false);
      setTimer(20);
    }
  });

  const startGame = (e) => {
    setResult(0);
    setTimerOn(true);
  };

  const handleClick = (e) => {
    game(e.target.id);
  };

  function game(buttonId) {
    if (timerOn === true) {
      let indEnglish = wordsEng.indexOf(wordEng);
      let indRussian = wordsRu.indexOf(wordRu);
      if (buttonId === "true") {
        if (indEnglish === indRussian) {
          ok.classList.add("active");
          setResult(result + points);
          play(okSound);
        } else if (indEnglish !== indRussian) {
          error.classList.add("active");
          play(errorSound);
        }
      } else if (buttonId === "false") {
        if (indEnglish !== indRussian) {
          ok.classList.add("active");
          setResult(result + points);
          play(okSound);
        } else if (indEnglish === indRussian) {
          error.classList.add("active");
          play(errorSound);
        }
      }
      setWordEng(wordsEng[Math.floor(Math.random() * wordsEng.length)]);
      setWordRu(wordsRu[Math.floor(Math.random() * wordsRu.length)]);
    }
  }

  function play(props) {
    const audio = new Audio(props);
    audio.play();
  }

  return (
    <div>
      <Container>
        <div className="sprint__content">
          <h2 className="sprint__title">СПРИНТ</h2>

          <div className="sprint__bg">
            <div className="game__timer">
              <p> Время</p>
              <p className="timer__counter" id="timer__counter">
                {timer}
              </p>
              <button
                className="btn__start"
                id="btn__start"
                onClick={startGame}
              >
                Старт
              </button>
            </div>
            <div className="sprint__game-card">
              <div className="game__card-title"></div>
              <div className="game__body">
                <div className="word__english">{wordEng}</div>
                <div className="word__russian">{wordRu}</div>
              </div>
              <div className="answer__result">
                <img src={okImg} className="ok__img" id="ok__img" />
                <img src={errorImg} className="error__img" id="error__img" />
              </div>
              <div className="game__card-vector"></div>

              <button className="btn__true" onClick={handleClick} id="true">
                Верно
              </button>
              <button className="btn__false" id="false" onClick={handleClick}>
                Неверно
              </button>
            </div>

            <div className="game__result" id="game__result">
              <p>Результат</p>
              <p className="result__counter" id="result__counter">
                {result}
              </p>
            </div>
            <img alt="sprint" src={sprint} className="sprint__bg" />
            <div className="parrot__container">
              <div className="parrot__1" id="parrot__1">
                <img
                  alt="parrot_1"
                  src={parrot_1}
                  className="parrot__1-img"
                  id="parrot__1"
                />
              </div>
              <div className="parrot__2" id="parrot__2">
                <img
                  alt="parrot_2"
                  src={parrot_2}
                  className="parrot__2-img"
                  id="parrot__2"
                />
              </div>
              <div className="parrot__3" id="parrot__3">
                <img
                  alt="parrot_3"
                  src={parrot_3}
                  className="parrot__3-img"
                  id="parrot__3"
                />
              </div>
              <div className="parrot__4" id="parrot__4">
                <img
                  alt="parrot_4"
                  src={parrot_4}
                  className="parrot__4-img"
                  id="parrot__4"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Sprint;
