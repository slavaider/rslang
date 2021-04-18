import React from "react";
import "./Home.css";
import { Container } from "react-bootstrap";
import hero from "../../assets/images/hero.jpg";
import Footer from "../Footer/Footer";

function Home() {
    return (
        <div>
            <Container fluid="xl" className="title__container">
                <h1 className="home__title">
                    Английский язык на раз, два, три!
                </h1>
                <img alt="hero" src={hero} className="hero__img" />
            </Container>
            <Container fluid="xl" className="text__container">
                <p className="home__text">
                    Хотите быстро выучить язык или подтянуть знания? Тогда Вы
                    пришли по адресу! Новейшая методика, увлекательный и
                    познавательный процесс обучения. Игровая форма обучения для
                    детей и взрослых. И все это в любое удобное для Вас время...
                </p>
            </Container>
            <Footer></Footer>
        </div>
    );
}

export default Home;
