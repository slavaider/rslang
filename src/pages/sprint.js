import React from "react";
import "../styles/sprint.css";
import sprint from "../assets/images/sprint.jpg";
import errorSound from "../assets/sounds/error.mp3";
import okSound from "../assets/sounds/ok.mp3";
import {asyncCreateWord} from "../store/actions/words";
import {asyncGetWords} from "../store/actions/book";
import {connect} from "react-redux";
import {BASE_URL} from "../config";
import {Button, ButtonGroup, Container, Modal, Row,} from "react-bootstrap";
import {group_variant, shuffle} from "../utils";
import {asyncSetStats} from "../store/actions/stats";
import {Link} from "react-router-dom";
import Spin from "../components/Spin/Spin";


class Sprint extends React.Component {
    constructor(props) {
        super(props);
        this.stats = {
            result: 0,
            points: 1,
        };
        this.state = {
            currentCount: 60,
            countOn: false,
            endGame: false,
            loading: false,
            block: false,
            show: true,
            timer: null,
            intervalId: null,
            wordsEng: [],
            wordsRu: [],
            wordEng: [],
            wordRu: [],
            okSound: okSound,
            errorSound: errorSound,
            questions: [],
            shuffle: [],
            page: 0,
            from: !!new URLSearchParams(this.props.location.search).get("book"),
            level: null,
            stats: null,
            rightWords: 0,
            errorWords: 0,
            answers: [],
            volume: 0.5,
        };
    }

    fullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen().catch();
        }
    };

    timer() {
        this.setState({
            currentCount: this.state.currentCount - 1,
        });
        if (this.state.currentCount < 1) {
            this.setState({countOn: false});
            document
                .getElementById("btn__start")
                .classList.remove("not__visible");
            document.getElementById("game__body").classList.add("not__visible");
            clearInterval(this.state.intervalId);
            this.setState({currentCount: 60});
            this.setState({endGame: true});
        }
    }

    startGame = () => {
        this.setState({countOn: true, show: true});

        const wordsRu = this.state.questions.map((el) => el.text_translate);
        const wordsEng = this.state.questions.map((el) => el.text);

        this.setState({wordsRu: wordsRu});
        this.setState({wordsEng: wordsEng});

        this.setState({
            wordEng: wordsEng[Math.floor(Math.random() * wordsEng.length)],
            wordRu: wordsRu[Math.floor(Math.random() * wordsRu.length)],
        });

        this.stats.result = 0;
        this.stats.errorWords = 0;
        this.stats.rightWords = 0;

        this.setState({intervalId: setInterval(this.timer.bind(this), 1000)});

        document.getElementById("btn__start").classList.add("not__visible");
        document.getElementById("game__body").classList.remove("not__visible");
    };

    handleClick = (e) => {
        if (this.state.countOn === true) {
            this.setState({buttonId: e.target.id});
            this.game(e.target.id);
        }
    };

    game = (buttonId) => {
        let indEnglish = this.state.wordsEng.indexOf(this.state.wordEng);
        let indRussian = this.state.wordsRu.indexOf(this.state.wordRu);

        if (buttonId === "true") {
            if (indEnglish === indRussian) {
                this.stats.rightWords += 1;
                this.stats.result = this.stats.result + this.stats.points;
                this.play(okSound);
                this.submit(true);
            } else {
                this.stats.errorWords += 1;
                this.play(errorSound);
                this.submit(false);
            }
        } else if (buttonId === "false") {
            if (indEnglish !== indRussian) {
                this.stats.rightWords += 1;
                this.stats.result = this.stats.result + this.stats.points;
                this.play(okSound);
                this.submit(true);
            } else {
                this.stats.errorWords += 1;
                this.play(errorSound);
                this.submit(false);
            }
        }
        this.setState({
            wordEng: this.state.wordsEng[
                Math.floor(Math.random() * this.state.wordsEng.length)
                ],
        });
        this.setState({
            wordRu: this.state.wordsRu[
                Math.floor(Math.random() * this.state.wordsRu.length)
                ],
        });
    };

    close = () => {
        this.setState({show: false});
    };

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

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
            if (this.state.questions.length !== 0) {
                // Shuffle
                const copy = this.state.questions
                    .filter(
                        (item) =>
                            item.text_translate !==
                            this.state.questions[this.state.page].text_translate
                    )
                    .map((item) => {
                        return item.text_translate;
                    });
                const shuffled = shuffle(copy);
                const four = [
                    shuffled[0],
                    this.state.questions[this.state.page].text_translate,
                ];
                const final = shuffle(four);
                this.setState({loading: true, shuffle: final});
            }
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
                } else {
                    if (this.state.loading) this.setState({block: true});
                }
            }
        }
        this.setState({questions: [...this.state.questions, ...words]});
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
            this.setState({learning_turn: false});
            this.getFromWords();
        }
        this.setState({questions: words});
    };

    getFromHeader = (group) => {
        const page = +(Math.random() * (30 - 1) + 1).toFixed(0);
        this.props.getWordsByState(group, page);
        this.setState({level: group});
    };

    answer = (game_type, value) => {
        // Stats
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
        // Shuffle
        if (typeof this.state.questions[this.state.page + 1] !== "undefined") {
            const copy = this.state.questions
                .filter(
                    (item) =>
                        item.text_translate !==
                        this.state.questions[this.state.page + 1].text_translate
                )
                .map((item) => {
                    return item.text_translate;
                });
            const shuffled = shuffle(copy);
            const four = [
                shuffled[0],
                this.state.questions[this.state.page + 1].text_translate,
            ];
            const final = shuffle(four);
            this.setState({shuffle: final});
        }
    };

    submit = (answer) => {
        if (typeof this.state.questions[this.state.page + 1] === "undefined") {
            this.setState({endGame: true});
        }
        let group = group_variant[+localStorage.getItem("group") - 1];
        if (this.state.level) {
            group = group_variant[this.state.level - 1];
        }
        if (answer === true) {
            this.setState((prevState) => ({
                page: prevState.page + 1,
                rightWords: prevState.rightWords + 1,
                answers: [
                    ...prevState.answers,
                    {
                        en: this.state.questions[this.state.page].text,
                        ru: this.state.questions[this.state.page].text_translate,
                        audio: this.state.questions[this.state.page].audio,
                        right: true
                    }
                ],
            }));
            this.answer("sprint", true);
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
            this.setState((prevState) => ({
                page: prevState.page + 1,
                errorWords: prevState.errorWords + 1,
                answers: [
                    ...prevState.answers,
                    {
                        en: this.state.questions[this.state.page].text,
                        ru: this.state.questions[this.state.page].text_translate,
                        audio: this.state.questions[this.state.page].audio,
                        right: false
                    }
                ],
            }));
            this.answer("sprint", false);
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
    };

    play = (src) => {
        const audio = new Audio(src);
        audio.volume = 0.25;
        audio.play().catch((e) => console.log(e));
    };

    playSound = (path, volume = this.state.volume) => {
        const audio = new Audio(`${BASE_URL}${path}`);
        audio.volume = volume;
        audio.play().catch((e) => console.log(e));
    };

    render() {
        if (this.state.level === null && !this.state.from) {
            return (
                <>
                    <Row className="justify-content-center">
                        <div className="levels__container-savanna">
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
                            </ButtonGroup>{" "}
                        </div>
                    </Row>
                </>
            );
        } else
            return (this.state.loading && this.state.questions.length >= 20) ||
            this.state.block ? (
                <Container>
                    {this.state.endGame ? (
                        <>
                            <div className="end__container">
                                <h3 className="end__text">Конец игры</h3>
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
                                      <Link to="/">
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
                            <div className="result">
                                <Modal
                                    centered
                                    size="lg"
                                    show={this.state.show}
                                    onHide={this.close}
                                    backdrop="static"
                                    keyboard={false}
                                    aria-labelledby="example-modal-sizes-title-lg"
                                >
                                    <Modal.Header>
                                        <Modal.Title id="title-center">
                                            <p className="modal-title">
                                                Статистика игры
                                            </p>
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="modal-text">
                                            Правильные ответы:
                                            {this.state.answers.filter((item) => item.right).map(
                                                (item) => (
                                                    <div className="answer__rows" key={"right" + item.en}>
                                                        <div
                                                            title="Озвучить"
                                                            className="audio__listen"
                                                            onClick={() => this.playSound(item.audio)}
                                                        />
                                                        <p className="modal-text-right">
                                                            {item.en}
                                                        </p>

                                                        <p className="modal-text-right">
                                                            -
                                                        </p>

                                                        <p className="modal-text-right">
                                                            {item.ru}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        <div className="modal-text">
                                            Не правильные ответы:
                                            {this.state.answers.filter((item) => item.right === false).map(
                                                (item) => (
                                                    <div className="answer__rows" key={"wrong" + item.en}>
                                                        <div
                                                            title="Озвучить"
                                                            className="audio__listen"
                                                            onClick={() =>
                                                                this.playSound(item.audio)
                                                            }
                                                        />
                                                        <p className="modal-text-error">
                                                            {item.en}
                                                        </p>

                                                        <p className="modal-text-error">
                                                            -
                                                        </p>

                                                        <p className="modal-text-error">
                                                            {item.ru}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
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
                            </div>
                        </>
                    ) : (
                        <div className="sprint__content">
                            <h2 className="sprint__title">СПРИНТ</h2>
                            <div
                                className="btn__full-screen"
                                onClick={this.fullScreen}
                            />
                            <div className="sprint__bg">
                                <div className="game__timer">
                                    <p> Время</p>
                                    <p
                                        className="timer__counter"
                                        id="timer__counter"
                                    >
                                        {this.state.currentCount}
                                    </p>
                                    <button
                                        className="btn__start"
                                        id="btn__start"
                                        onClick={this.startGame}
                                    >
                                        Старт
                                    </button>
                                </div>
                                <div className="sprint__game-card">
                                    <div className="game__card-title"/>
                                    <div
                                        className="game__body not__visible"
                                        id="game__body"
                                    >
                                        <div className="word__english">
                                            {this.state.wordEng}
                                        </div>
                                        <div className="word__russian">
                                            {this.state.wordRu}
                                        </div>
                                    </div>

                                    <div className="game__card-vector"/>

                                    <button
                                        className="btn__true"
                                        onClick={this.handleClick}
                                        id="true"
                                    >
                                        Верно
                                    </button>
                                    <button
                                        className="btn__false"
                                        id="false"
                                        onClick={this.handleClick}
                                    >
                                        Неверно
                                    </button>
                                </div>

                                <div className="game__result" id="game__result">
                                    <p>Результат</p>
                                    <p
                                        className="result__counter"
                                        id="result__counter"
                                    >
                                        {this.stats.result}
                                    </p>
                                </div>
                                <img
                                    alt="sprint"
                                    src={sprint}
                                    className="sprint__bg"
                                />
                            </div>
                        </div>
                    )}
                </Container>
            ) : <Spin/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Sprint);
