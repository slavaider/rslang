import React from "react";
import { Container } from "react-bootstrap";
import "../styles/rules.css";

function Rules() {
	return (
		<div>
			<Container>
				<h1 className="rules__title">Правила игр:</h1>
				<h2 className="game__name">Саванна</h2>
				<p className="game__rules">
					Вам дается всего 5 попыток ошибиться в ответе из
					предложенных вариантов.
				</p>
				<h2 className="game__name">Аудиовызов</h2>
				<p className="game__rules">
					Вам необходимо угадать слово из предложенных 5 вариантов. В
					данной игре английский вариант можно прослушать.
				</p>
				<h2 className="game__name">Спринт</h2>
				<p className="game__rules">
					За определенное время Вам необходимо угадать перевод слова
					на русский язык. Ответ "Верно" - если перевод соответствует,
					или ответ "Неверно" - если не соответствует.
				</p>
				<h2 className="game__name">Наша игра</h2>
				<p className="game__rules">
					По смыслу карнтинки необходимо вписать английское слово в
					данное Вам предложение.
				</p>
			</Container>
		</div>
	);
}

export default Rules;
