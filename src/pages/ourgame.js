import React from "react";
import {
	Button,
	ButtonGroup,
	Card,
	Container,
	Form,
	InputGroup,
	Row,
	Modal,
} from "react-bootstrap";
import { asyncCreateWord } from "../store/actions/words";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config";
import { asyncGetWords } from "../store/actions/book";
import { connect } from "react-redux";
import { asyncSetStats } from "../store/actions/stats";
import Spin from "../components/Spin/Spin";
import { group_variant, shuffle } from "../utils";
import "../styles/ourgame.css";
import errorSound from "../assets/sounds/error.mp3";
import okSound from "../assets/sounds/ok.mp3";

class Ourgame extends React.Component {
	state = {
		questions: [],
		page: 0,
		right: null,
		endgame: false,
		block: false,
		from: !!new URLSearchParams(this.props.location.search).get("book"),
		level: null,
		loading: false,
		show: true,
		okSound: okSound,
		errorSound: errorSound,
		rightWords: 0,
		errorWords: 0,
	};
	close = () => {
		this.setState({ show: false, endGame: false });
	};

	fullScreen = (e) => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen().catch();
		}
	};

	componentDidMount() {
		if (this.state.from && this.props.learning.length !== 0) {
			this.getFromLearning();
		} else {
			this.getFromWords();
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (
			prevProps.learning !== this.props.learning &&
			prevState.questions.length < 20
		) {
			if (this.state.from) {
				this.getFromLearning();
			}
		}
		if (
			prevProps.words !== this.props.words &&
			prevState.questions.length < 20
		) {
			if (!this.state.block) {
				this.getFromWords();
			}
		}
		if (prevState.questions !== this.state.questions) {
			if (this.state.questions.length !== 0)
				this.setState({ loading: true });
		}
	}

	getFromWords = () => {
		const words = [];
		let group = group_variant[+localStorage.getItem("group") - 1];
		if (this.state.level) {
			group = group_variant[this.state.level - 1];
		}
		this.props.words.forEach((word) => {
			const notLearn = !this.props.learning.find(
				(el) => el.wordId === word.id
			);
			const notDelete = !this.props.deleted.find(
				(el) => el.wordId === word.id
			);
			if (notLearn && notDelete) {
				this.props.createWord(
					"learn",
					group,
					word.word,
					word.wordTranslate,
					word.id,
					word.image,
					word.textExample,
					word.textExampleTranslate,
					this.props.id,
					this.props.token,
					0,
					0,
					word.audio,
					false
				);
				let mask = "";
				for (let i = 0; i < word.word.length; i++) {
					mask += "*";
				}
				words.push({
					text: word.word,
					text_translate: word.wordTranslate,
					img: word.image,
					id: word.id,
					example: word.textExample.replace(
						`${word.word}`,
						mask + `[${word.word.length}]`
					),
					raw: word.textExample,
					translate: word.textExampleTranslate,
					variant: group,
					audio: word.audio,
					hard: false,
				});
			}
		});
		if (this.state.from) {
			if (this.state.questions.length + words.length < 20) {
				if (+localStorage.getItem("page") !== 1) {
					this.props.getWordsByState(
						+localStorage.getItem("group"),
						+localStorage.getItem("page") - 1
					);
					localStorage.setItem(
						"page",
						(+localStorage.getItem("page") - 1).toString()
					);
				} else this.setState({ block: true });
			}
		}
		this.setState({ questions: [...this.state.questions, ...words] });
	};

	getFromLearning = () => {
		const words = [];
		shuffle(this.props.learning).every((word) => {
			let mask = "";
			for (let i = 0; i < word.value.length; i++) {
				mask += "*";
			}
			words.push({
				text: word.value,
				text_translate: word.translate,
				img: word.image,
				id: word.wordId,
				example: word.textExample.replace(
					`${word.value}`,
					mask + `[${word.value.length}]`
				),
				raw: word.textExample,
				translate: word.textExampleTranslate,
				variant: word.group,
				audio: word.audio,
				hard: word.hard,
			});
			return words.length < 20;
		});
		if (words.length < 20) {
			this.setState({ learning_turn: false });
			this.getFromWords();
		}
		this.setState({ questions: words });
	};

	getFromHeader = (group) => {
		const page = +(Math.random() * (30 - 1) + 1).toFixed(0);
		this.props.getWordsByState(group, page);
		this.setState({ level: group });
	};

	answer = (game_type, value) => {
		const copy = this.props.stats.optional[new Date().toLocaleDateString()];
		copy.wordPerDay += 1;
		const game = copy[game_type];
		game.count += 1;
		if (value) {
			game.success += 1;
			game.series += 1;
		} else {
			game.series = 0;
		}
		this.props.setStats(this.props.id, this.props.token, copy);
	};

	submit = (e) => {
		e.preventDefault();
		let group = group_variant[+localStorage.getItem("group") - 1];
		if (this.state.level) {
			group = group_variant[this.state.level - 1];
		}
		const answer = e.target.answer.value.toLowerCase();
		if (answer === this.state.questions[this.state.page].text) {
			this.play(this.state.okSound);
			this.setState({ rightWords: this.state.rightWords + 1 });
			this.answer("our", true);
			this.setState((prevState) => ({
				page: prevState.page + 1,
				right: true,
			}));
			this.props.createWord(
				"learn",
				group,
				this.state.questions[this.state.page].text,
				this.state.questions[this.state.page].text_translate,
				this.state.questions[this.state.page].id,
				this.state.questions[this.state.page].img,
				this.state.questions[this.state.page].raw,
				this.state.questions[this.state.page].translate,
				this.props.id,
				this.props.token,
				0,
				1,
				this.state.questions[this.state.page].audio,
				this.state.questions[this.state.page].hard
			);
		} else {
			this.play(this.state.errorSound);
			this.setState({ errorWords: this.state.errorWords + 1 });
			this.answer("our", false);
			this.setState((prevState) => ({
				page: prevState.page + 1,
				right: false,
			}));
			this.props.createWord(
				"learn",
				group,
				this.state.questions[this.state.page].text,
				this.state.questions[this.state.page].text_translate,
				this.state.questions[this.state.page].id,
				this.state.questions[this.state.page].img,
				this.state.questions[this.state.page].raw,
				this.state.questions[this.state.page].translate,
				this.props.id,
				this.props.token,
				1,
				0,
				this.state.questions[this.state.page].audio,
				this.state.questions[this.state.page].hard
			);
		}
		if (typeof this.state.questions[this.state.page + 1] === "undefined") {
			this.setState({ endgame: true });
		}
	};

	play = (props) => {
		const audio = new Audio(props);
		audio.volume = 0.25;
		audio.play();
	};

	render() {
		if (this.state.level === null && !this.state.from) {
			return (
				<>
					<Row className="justify-content-center">
						<div className="levels__container-ourgame">
							<h1>Выберите уровень сложности</h1>
							<ButtonGroup className="mx-2 my-2">
								<Button
									onClick={() => this.getFromHeader(1)}
									variant="outline-dark"
								>
									1
								</Button>
								<Button
									onClick={() => this.getFromHeader(2)}
									variant="outline-info"
								>
									2
								</Button>
								<Button
									onClick={() => this.getFromHeader(3)}
									variant="outline-success"
								>
									3
								</Button>
								<Button
									onClick={() => this.getFromHeader(4)}
									variant="outline-primary"
								>
									4
								</Button>
								<Button
									onClick={() => this.getFromHeader(5)}
									variant="outline-secondary"
								>
									5
								</Button>
								<Button
									onClick={() => this.getFromHeader(6)}
									variant="outline-danger"
								>
									6
								</Button>
							</ButtonGroup>
						</div>
					</Row>
				</>
			);
		} else
			return (this.state.loading && this.state.questions.length >= 20) ||
				this.state.block ? (
				<Container>
					{this.state.endgame ? (
						<>
							<div className="end__container">
								<h3 className="text-center">Конец игры </h3>
								<span className="end__btns">
									<ButtonGroup className="btn-group-end">
										<Link to="/book">
											<Button
												variant="info"
												size="lg"
												className="end__btn"
											>
												Вернуться в учебник
											</Button>
										</Link>
										<Link to="/book">
											<Button
												variant="info"
												size="lg"
												className="end__btn"
											>
												На главную
											</Button>
										</Link>
									</ButtonGroup>
								</span>
							</div>
							<Modal
								centered
								size="lg"
								show={this.state.show}
								onHide={this.close}
								backdrop="static"
								keyboard={false}
								aria-labelledby="example-modal-sizes-title-lg"
							>
								<Modal.Header closeButton>
									<Modal.Title id="example-modal-sizes-title-lg">
										Статистика игры
									</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									<p className="modal-text">
										Верных ответов:
										{this.state.rightWords}
									</p>
									<p className="modal-text">
										Неверных ответов:
										{this.state.errorWords}
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="secondary"
										onClick={this.close}
									>
										Продолжить
									</Button>
									<Link to="/games/stats?sprint=true">
										<Button variant="secondary">
											Статистика
										</Button>
									</Link>
								</Modal.Footer>
							</Modal>
						</>
					) : (
						<>
							<h2 className="text-center">
								Отгадай слово по картинке и описанию
							</h2>
							<div
								className="btn__full-screen"
								onClick={this.fullScreen}
							></div>
							<Row className="justify-content-center">
								<Card
									bg={
										this.state.questions[this.state.page]
											.variant
									}
									key={
										"ourgame" +
										this.state.questions[this.state.page].id
									}
									text={"light"}
									className="my-2 mx-2"
								>
									<Card.Img
										variant="top"
										src={`${BASE_URL}${
											this.state.questions[
												this.state.page
											].img
										}`}
									/>
									<Card.Text className="text-center mt-2">
										<span
											dangerouslySetInnerHTML={{
												__html: this.state.questions[
													this.state.page
												].example,
											}}
										/>
									</Card.Text>
									<Card.Footer>
										<Form onSubmit={(e) => this.submit(e)}>
											<InputGroup>
												<Form.Control
													name="answer"
													placeholder="Answer"
												/>
												<InputGroup.Append>
													<Button
														variant="success"
														type="submit"
													>
														Ответить
													</Button>
												</InputGroup.Append>
											</InputGroup>
										</Form>
										Осталось слов{" "}
										{this.state.questions.length -
											this.state.page}
										{this.state.right !== null ? (
											this.state.right ? (
												<p className="text-success">
													Верно
												</p>
											) : (
												<p className="text-danger">
													Неверно
												</p>
											)
										) : null}
									</Card.Footer>
								</Card>
							</Row>
						</>
					)}
				</Container>
			) : (
				<Spin />
			);
	}
}

function mapStateToProps(state) {
	return {
		learning: state.words.learning,
		deleted: state.words.deleted,
		words: state.book.words,
		id: state.auth.id,
		token: state.auth.token,
		stats: state.stats.statistic,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		createWord: (
			type,
			group,
			value,
			translate,
			wordId,
			image,
			textExample,
			textExampleTranslate,
			userId,
			token,
			fail,
			success,
			audio,
			hard
		) =>
			dispatch(
				asyncCreateWord(
					type,
					group,
					value,
					translate,
					wordId,
					image,
					textExample,
					textExampleTranslate,
					userId,
					token,
					fail,
					success,
					audio,
					hard
				)
			),
		getWordsByState: (group, page) => dispatch(asyncGetWords(group, page)),
		setStats: (id, token, value) =>
			dispatch(asyncSetStats(id, token, value)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Ourgame);
