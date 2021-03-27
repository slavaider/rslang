import React from "react";
import "./Home.css";
import { Container } from "react-bootstrap";
import hero from "../../assets/images/hero.jpg";

function Home() {
  return (
    <div>
      <Container fluid="xl" className="title__container">
        <h1 className="home__title">Английский язык на 1,2,3!</h1>
        <img src={hero} className="hero__img" />
      </Container>
      <Container fluid="xl" className="text__container">
        <p className="home__text">
          Хотите быстро выучить язык или подтянуть знания? Тогда Вы пришли по
          адресу! Новейшая методика, увлекательный и познавательный процесс
          обучения. Игровая форма обучения для детей и взрослых. И все это в
          любое удобное для Вас время...
        </p>
      </Container>
    </div>
  );
}

export default Home;
