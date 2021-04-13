import React from "react";
import { Container } from "react-bootstrap";
import Footer from "../components/Footer/Footer";
import "../styles/ourteam.css";

function Ourteam() {
	return (
		<>
			<div>
				<Container>
					<h1 className="team__title">Наша Команда</h1>
					<div className="about__pearson">
						<a href="https://github.com/slavaider">
							<div className="team__lead"> </div>
						</a>
						<p className="team__text">
							Ведущий разработчик нашей команды. Специалист по JS,
							ReactJs, Vue, MongoDb. Написал бэкэнд логику
							приложения, игры - Саванна, Аудиовызов, Наша Игра.
						</p>
					</div>
					<div className="about__pearson">
						<a href="https://github.com/VVK1978">
							<div className="team__junior"> </div>
						</a>
						<p className="team__text">
							Начинающий разработчик в JS и ReactJs. Написал
							логику игры Спринт, адаптивная верстка приложения.
						</p>
					</div>
				</Container>
			</div>
			<Footer></Footer>
		</>
	);
}

export default Ourteam;
