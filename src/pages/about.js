import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/about.css";
// import game from "../assets/images/play.jpg";
import Footer from "../components/Footer/Footer";

function About() {
    return (
        <div className="about">
            <Container fluid="xl">
                <h2 className="about__header">Наши особенности</h2>
            </Container>
            <Container fluid="xl">
                <Row className="about">
                    <Col className="about__card">
                        <div className="card__info">
                            <h3 className="card__title">Игры</h3>
                            <p className="card__text">
                                Английский в игровой форме - не только
                                позновательно, но и интересно. Получайте новые
                                знания играя в наши игры, будет интересно не
                                только детям, но и взрослым.
                            </p>
                        </div>
                        <div className="card__img-games"></div>
                    </Col>
                    <Col className="about__card">
                        {" "}
                        <div className="card__info">
                            <h3 className="card__title">Мы Онлайн 24/7</h3>
                            <p className="card__text">
                                Изучайте язык когда Вам удобно, так как наша
                                платформа доступна 24/7 круглый год. Остается
                                только найти свободное время и с головой
                                погрузиться в увлекательный процесс изучения
                                английского языка.
                            </p>
                        </div>
                        <div className="card__img-247"></div>
                    </Col>
                </Row>
                <Row className="about">
                    <Col className="about__card">
                        {" "}
                        <div className="card__info">
                            <h3 className="card__title">Статистика</h3>
                            <p className="card__text">
                                Прогресс своего обучения Вы можете
                                контролировать в статистике нашего приложения.
                                Здесь Вы увидите свои слабые и сильные стороны.
                            </p>
                        </div>
                        <div className="card__img-stats"></div>
                    </Col>
                    <Col className="about__card">
                        {" "}
                        <div className="card__info">
                            <h3 className="card__title">
                                Метод интервальных повторений
                            </h3>
                            <p className="card__text">
                                В тренировке "Карточки" используется метод
                                интервальных повторений, который признан одним
                                из самых эффективных в изучении новых языков.
                            </p>
                        </div>
                        <div className="card__img-method"></div>
                    </Col>
                </Row>
            </Container>
            <Footer></Footer>
        </div>
    );
}

export default About;
