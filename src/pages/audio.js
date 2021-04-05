import React from "react";
import {Button, ButtonGroup, Container, Row, Spinner} from "react-bootstrap";
import "../styles/audiocall.css";
import phones from "../assets/icons/phones.svg";
import speaker from "../assets/icons/speaker.svg";
import {Link} from "react-router-dom";
import {asyncCreateWord} from "../store/actions/words";
import {asyncGetWords} from "../store/actions/book";
import {asyncSetStats} from "../store/actions/stats";
import {connect} from "react-redux";
import {BASE_URL} from "../config";

const group_variant = ["dark", "info", "success", "primary", "secondary", "danger"]


class AudioCall extends React.Component {

    state = {
        questions: [],
        shuffle: [],
        page: 0,
        endgame: false,
        block: false,
        from: null,
        level: null,
        loading: false
    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search)
        const from = !!query.get("book")
        if (from && this.props.learning.length !== 0) {
            this.getFromLearning()
        } else {
            this.getFromWords()
        }
        this.setState({from})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevProps.learning !== this.props.learning) && prevState.questions.length < 20) {
            if (this.state.from) {
                this.getFromLearning()
            }
        }
        if ((prevProps.words !== this.props.words) && prevState.questions.length < 20) {
            if (!this.state.block) {
                this.getFromWords()
            }
        }
        if (prevState.questions !== this.state.questions) {
            if (this.state.questions.length !== 0) {
                // Shuffle
                const copy = this.state.questions
                    .filter(item => item.text_translate !== this.state.questions[this.state.page].text_translate)
                    .map((item) => {
                        return item.text_translate
                    })
                const shuffled = this.shuffle(copy)
                const four = [shuffled[0], shuffled[1], shuffled[2], shuffled[3], this.state.questions[this.state.page].text_translate]
                const final = this.shuffle(four)
                this.setState({loading: true, shuffle: final})
            }
        }
    }

    shuffle = (array) => {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


    getFromWords = () => {
        const words = []
        let group = group_variant[+localStorage.getItem("group") - 1]
        if (this.state.level) {
            group = group_variant[this.state.level - 1]
        }
        this.props.words.forEach((word) => {
                const notLearn = !this.props.learning.find((el) => el.wordId === word.id)
                const notDelete = !this.props.deleted.find((el) => el.wordId === word.id)
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
                        false)
                    let mask = ""
                    for (let i = 0; i < word.word.length; i++) {
                        mask += "*"
                    }
                    words.push({
                        text: word.word,
                        text_translate: word.wordTranslate,
                        img: word.image,
                        id: word.id,
                        example: word.textExample.replace(`${word.word}`, mask + `[${word.word.length}]`),
                        raw: word.textExample,
                        translate: word.textExampleTranslate,
                        variant: group,
                        audio: word.audio,
                        hard: false
                    })
                }
            }
        )
        if (this.state.from) {
            if (this.state.questions + words.length < 20) {
                if (+localStorage.getItem("page") > 1) {
                    this.props.getWordsByState(+localStorage.getItem("group"), +localStorage.getItem("page") - 1)
                    localStorage.setItem("page", (+localStorage.getItem("page") - 1).toString())
                } else
                    this.setState({block: true})
            }
        }
        this.setState({questions: [...this.state.questions, ...words]})
    }

    getFromLearning = () => {
        const words = []
        this.shuffle(this.props.learning).every((word) => {
            let mask = ""
            for (let i = 0; i < word.value.length; i++) {
                mask += "*"
            }
            words.push({
                text: word.value,
                text_translate: word.translate,
                img: word.image,
                id: word.wordId,
                example: word.textExample.replace(`${word.value}`, mask + `[${word.value.length}]`),
                raw: word.textExample,
                translate: word.textExampleTranslate,
                variant: word.group,
                audio: word.audio,
                hard: word.hard
            })
            return words.length < 20;
        })
        if (words.length < 20) {
            this.setState({learning_turn: false})
            this.getFromWords()
        }
        this.setState({questions: words})
    }
    playSound = (path) => {
        const audio = new Audio(`${BASE_URL}${path}`);
        audio.play();
    }

    getFromHeader = (group) => {
        const page = +(Math.random() * (30 - 1) + 1).toFixed(0)
        this.props.getWordsByState(group, page)
        this.setState({level: group})
    }

    answer = (game_type, value) => {
        // Stats
        const stat = this.props.stats.optional[new Date().toLocaleDateString()]
        stat.wordPerDay += 1
        const game = stat[game_type]
        game.count += 1
        if (value) {
            game.success += 1
            game.series += 1
        } else {
            game.series = 0
        }
        this.props.setStats(this.props.id, this.props.token, stat)
        // Shuffle
        if (typeof this.state.questions[this.state.page + 1] !== "undefined") {
            const copy = this.state.questions
                .filter(item => item.text_translate !== this.state.questions[this.state.page + 1].text_translate)
                .map((item) => {
                    return item.text_translate
                })
            const shuffled = this.shuffle(copy)
            const four = [shuffled[0], shuffled[1], shuffled[2], shuffled[3], this.state.questions[this.state.page + 1].text_translate]
            const final = this.shuffle(four)
            this.setState({shuffle: final})
        }
    }

    submit = (answer) => {
        if (typeof this.state.questions[this.state.page + 1] === "undefined") {
            this.setState({endgame: true})
        }
        let group = group_variant[+localStorage.getItem("group") - 1]
        if (answer === this.state.questions[this.state.page].text_translate) {
            this.setState((prevState) => ({
                page: prevState.page + 1
            }))
            this.answer("audio", true)
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
            )
        } else {
            this.setState((prevState) => ({
                page: prevState.page + 1
            }))
            this.answer("audio", false)
            this.props.createWord("learn",
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
            )
        }
    }

    render() {
        if (this.state.level === null && !this.state.from) {
            return (
                <>
                    <Row className="justify-content-center">
                        <h1>Выберите уровень сложности</h1>
                        <ButtonGroup className="mx-2 my-2">
                            <Button onClick={() => this.getFromHeader(1)}
                                    variant="outline-dark">1</Button>
                            <Button onClick={() => this.getFromHeader(2)}
                                    variant="outline-info">2</Button>
                            <Button onClick={() => this.getFromHeader(3)}
                                    variant="outline-success">3</Button>
                            <Button onClick={() => this.getFromHeader(4)}
                                    variant="outline-primary">4</Button>
                            <Button onClick={() => this.getFromHeader(5)}
                                    variant="outline-secondary">5</Button>
                            <Button onClick={() => this.getFromHeader(6)}
                                    variant="outline-danger">6</Button>
                        </ButtonGroup>
                    </Row>
                </>
            )
        } else
            return ((this.state.loading && this.state.questions.length >= 20) || this.state.block ?
                <Container>
                    {this.state.endgame ? <>
                            <h3 className="text-center">Конец игры
                                <span>
                                    <ButtonGroup>
                                        <Link to="/book">
                                           <Button variant="info">Вернуться в учебник</Button>
                                        </Link>
                                        <Link to="/book">
                                            <Button variant="info">На главную</Button>
                                        </Link>
                                    </ButtonGroup>
                                </span>
                            </h3>
                        </> :
                        <div className="audiocall__content">
                            <h2 className="audiocall__title">АУДИОВЫЗОВ</h2>
                            <img alt="speaker"
                                 onClick={() => this.playSound(this.state.questions[this.state.page].audio)}
                                 src={speaker} className="speaker__img"/>
                            <div className="audiocall__word">
                                <img src={`${BASE_URL}${this.state.questions[this.state.page].img}`}
                                     alt={this.state.questions[this.state.page].img}/>
                                <p id="word">{this.state.questions[this.state.page].text}</p>
                            </div>
                            <div className="btn__container-audiocall">
                                {this.state.shuffle.map((item) => {
                                    return (
                                        <button key={item} className="btn__audiocall"
                                                onClick={() => this.submit(item)}>
                                            {item}
                                        </button>
                                    )
                                })}
                            </div>
                            <img alt="audiocall" src={phones} className="audiocall__bg"/>
                        </div>}
                </Container> :
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: 374}}>
                    <Spinner size="lg" animation="border" variant="primary"/>
                </div>)
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createWord: (type, group, value, translate, wordId, image, textExample, textExampleTranslate, userId, token, fail, success, audio, hard) => dispatch(asyncCreateWord(type, group, value, translate, wordId, image, textExample, textExampleTranslate, userId, token, fail, success, audio, hard)),
        getWordsByState: (group, page) => dispatch(asyncGetWords(group, page)),
        setStats: (id, token, value) => dispatch(asyncSetStats(id, token, value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioCall)


