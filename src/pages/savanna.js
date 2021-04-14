import React from "react";
import {
    Button,
    ButtonGroup,
    Container,
    Row,
    Spinner,
    Modal,
} from "react-bootstrap";
import "../styles/savanna.css";
import savannah from "../assets/images/savannah.jpg";
import heart from "../assets/icons/heart.svg";
import { BASE_URL } from "../config";
import { asyncCreateWord } from "../store/actions/words";
import { asyncGetWords } from "../store/actions/book";
import { asyncSetStats } from "../store/actions/stats";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { group_variant, shuffle } from "../utils";
import errorSound from "../assets/sounds/error.mp3";
import okSound from "../assets/sounds/ok.mp3";

export function hearts(n) {
    const hearts = [
        <img
            alt={`heart_1`}
            key={"heart_1"}
            src={heart}
            className="heart__img"
        />,
        <img
            alt={`heart_2`}
            key={"heart_2"}
            src={heart}
            className="heart__img"
        />,
        <img
            alt={`heart_3`}
            key={"heart_3"}
            src={heart}
            className="heart__img"
        />,
        <img
            alt={`heart_4`}
            key={"heart_4"}
            src={heart}
            className="heart__img"
        />,
        <img
            alt={`heart_5`}
            key={"heart_5"}
            src={heart}
            className="heart__img"
        />,
    ];
    return hearts.map((item, index) => {
        if (index < n) return item;
        return null;
    });
}

class Savanna extends React.Component {
    state = {
        questions: [],
        shuffle: [],
        page: 0,
        lives: 5,
        endgame: false,
        block: false,
        from: !!new URLSearchParams(this.props.location.search).get("book"),
        level: null,
        loading: false,
        show: true,
        okSound: okSound,
        errorSound: errorSound,
        answerRightEn: [],
        answerErrorEn: [],
        answerRightRu: [],
        answerErrorRu: [],
        answerAudioRightEn: [],
        answerAudioErrorEn: [],
        volume: 0.5,
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
                    shuffled[1],
                    shuffled[2],
                    this.state.questions[this.state.page].text_translate,
                ];
                const final = shuffle(four);
                this.setState({ loading: true, shuffle: final });
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
                shuffled[1],
                shuffled[2],
                this.state.questions[this.state.page + 1].text_translate,
            ];
            const final = shuffle(four);
            this.setState({ shuffle: final });
        }
    };

    submit = (answer) => {
        if (this.state.lives === 1) this.setState({ endgame: true });
        if (typeof this.state.questions[this.state.page + 1] === "undefined") {
            this.setState({ endgame: true });
        }
        let group = group_variant[+localStorage.getItem("group") - 1];
        if (answer === this.state.questions[this.state.page].text_translate) {
			this.play(this.state.okSound);
			
            this.setState((prevState) => ({
                answerRightEn: [
                    ...prevState.answerRightEn,
                    this.state.questions[this.state.page].text,
                ],
            }));

            this.setState((prevState) => ({
                answerRightRu: [
                    ...prevState.answerRightRu,

                    this.state.questions[this.state.page].text_translate,
                ],
            }));

            this.setState((prevState) => ({
                answerAudioRightEn: [
                    ...prevState.answerAudioRightEn,

                    this.state.questions[this.state.page].audio,
                ],
            }));

            this.setState((prevState) => ({
                page: prevState.page + 1,
            }));
            this.answer("savanna", true);
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
                answerErrorEn: [
                    ...prevState.answerErrorEn,
                    this.state.questions[this.state.page].text,
                ],
            }));
            this.setState((prevState) => ({
                answerErrorRu: [
                    ...prevState.answerErrorRu,
                    this.state.questions[this.state.page].text_translate,
                ],
            }));

            this.setState((prevState) => ({
                answerAudioErrorEn: [
                    ...prevState.answerAudioErrorEn,

                    this.state.questions[this.state.page].audio,
                ],
            }));

            this.play(this.state.errorSound);
            this.setState({ errorWords: this.state.errorWords + 1 });
            this.setState((prevState) => ({
                page: prevState.page + 1,
                lives: prevState.lives - 1,
            }));
            this.answer("savanna", false);
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

    play = (props) => {
        const audio = new Audio(props);
        audio.volume = 0.25;
        audio.play();
    };

    playSound = (path, volume) => {
        const audio = new Audio(`${BASE_URL}${path}`);
        audio.volume = volume;
        audio.play();
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
                    {this.state.endgame ? (
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
                                    <div className="modal-text">
                                        Правильные ответы:
                                        {this.state.answerRightEn.map(
                                            (el, ind) => (
                                                <>
                                                    <div className="answer__rows">
                                                        <div
                                                            title="Озвучить"
                                                            className="audio__listen"
                                                            onClick={() =>
                                                                this.playSound(
                                                                    this.state
                                                                        .answerAudioRightEn[
                                                                        ind
                                                                    ],
                                                                    this.state
                                                                        .volume
                                                                )
                                                            }
                                                        ></div>
                                                        <p className="modal-text-right">
                                                            {el}
                                                        </p>

                                                        <p className="modal-text-right">
                                                            -
                                                        </p>

                                                        <p className="modal-text-right">
                                                            {
                                                                this.state
                                                                    .answerRightRu[
                                                                    ind
                                                                ]
                                                            }
                                                        </p>
                                                    </div>
                                                </>
                                            )
                                        )}
                                    </div>
                                    <div className="modal-text">
                                        Не правильные ответы:
                                        {this.state.answerErrorEn.map(
                                            (el, ind) => (
                                                <>
                                                    <div className="answer__rows">
                                                        <div
                                                            title="Озвучить"
                                                            className="audio__listen"
                                                            onClick={() =>
                                                                this.playSound(
                                                                    this.state
                                                                        .answerAudioErrorEn[
                                                                        ind
                                                                    ],
                                                                    this.state
                                                                        .volume
                                                                )
                                                            }
                                                        ></div>
                                                        <p className="modal-text-error">
                                                            {el}
                                                        </p>

                                                        <p className="modal-text-error">
                                                            -
                                                        </p>

                                                        <p className="modal-text-error">
                                                            {
                                                                this.state
                                                                    .answerErrorRu[
                                                                    ind
                                                                ]
                                                            }
                                                        </p>
                                                    </div>
                                                </>
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
                        </>
                    ) : (
                        <div className="savanna">
                            <div className="savanna__content">
                                <div className="savanna__header">
                                    <h2 className="savanna__title">
                                        САВАННА <br />
                                    </h2>
                                    <div
                                        className="btn__full-screen"
                                        onClick={this.fullScreen}
                                    ></div>
                                    <p className="savanna__count">
                                        Осталось слов:
                                        {this.state.questions.length -
                                            this.state.page}
                                    </p>
                                    <div className="heart__container">
                                        {hearts(this.state.lives)}
                                    </div>
                                </div>
                                <div className="savanna__question">
                                    <p className="question__text">
                                        {
                                            this.state.questions[
                                                this.state.page
                                            ].text
                                        }
                                    </p>
                                </div>
                                <div className="btn__container">
                                    {this.state.shuffle.map((item) => {
                                        return (
                                            <button
                                                key={item}
                                                className="btn__savanna"
                                                onClick={() =>
                                                    this.submit(item)
                                                }
                                            >
                                                {item}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <img
                                alt="savanna"
                                src={savannah}
                                className="savanna__bg"
                            />
                        </div>
                    )}
                </Container>
            ) : (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: 374 }}
                >
                    <Spinner size="lg" animation="border" variant="primary" />
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Savanna);
