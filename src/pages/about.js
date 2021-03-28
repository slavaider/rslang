import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/about.css";
// import game from "../assets/images/play.jpg";

function About() {
  return (
    <div className="about">
      <Container fluid="xl">
        <h2 className="about__header">Наши особенности</h2>
      </Container>
      <Container fluid="xl">
        <Row>
          <Col className="about__card" xl={6}>
            <div className="card__img-games">
              <h3>Игры</h3>
              <p className="card__text">
                Английский в игровой форме - не только позновательно, но и
                интересно
              </p>
            </div>
          </Col>
          <Col className="about__card">
            <div className="card__img-247">
              <h3>Мы Онлайн 24/7</h3>
              <p className="card__text">
                Изучайте язык когда вам удобно, так как наша платформа доступна
                24/7 круглый год
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="about__card" xl={6}>
            <div className="card__img-stats">
              <h3>Статистика</h3>
              <p className="card__text">
                Прогресс своего обучения Вы можете контролировать в статистике
                по Вашему обучению
              </p>
            </div>
          </Col>
          <Col className="about__card">
            <div className="card__img-method">
              <h3>Метод интервальных повторений</h3>
              <p className="card__text">
                В тренировке "Карточки" используется метод интервальных
                повторений, который признан одним из самых эффективных в
                изучении новых языков.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default About;
