import React from "react";
import {Button, ButtonGroup, Card, Container, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {connect} from "react-redux";
import {asyncCreateWord} from "../store/actions/words";
import {Link} from "react-router-dom"
import {BASE_URL} from "../config";
import {asyncGetWords} from "../store/actions/book";


const group_variant = ["dark", "info", "success", "primary", "secondary", "danger"]


class Ourgame extends React.Component {

    state = {
        questions: [],
        page: 0,
        right: null,
        endgame: false,
        block: false,
        from: null,
        level: null
    }


    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search)
        const from = !!query.get("book")
        if (from && this.props.learning.length !== 0) {
            this.getFromLearning()
        }
        if (from && this.props.words.length !== 0) {
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
    }

    getFromWords = () => {
        const words = []
        let group = group_variant[+localStorage.getItem("group") - 1]
        if (this.state.level) {
            group = group_variant[this.state.level - 1]
        }
        this.props.words.forEach((word) => {
            if (!this.props.learning.includes((el) => el.wordId === word.id) && !this.props.deleted.includes((el) => el.wordId === word.id)) {
                this.props.createWord(
                    "learn",
                    group,
                    word.word,
                    word.id,
                    word.image,
                    word.textExample,
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
                    img: word.image,
                    id: word.id,
                    example: word.textExample.replace(`${word.word}`, mask + `[${word.word.length}]`),
                    variant: group,
                    audio: word.audio,
                    hard: false
                })
            }
        })
        if (this.state.questions + words.length < 20) {
            if (+localStorage.getItem("page") > 1) {
                this.props.getWordsByState(+localStorage.getItem("group"), +localStorage.getItem("page") - 1)
                localStorage.setItem("page", (+localStorage.getItem("page") - 1).toString())
            } else
                this.setState({block: true})
        }
        this.setState({questions: [...this.state.questions, ...words]})
    }

    getFromLearning = () => {
        const words = []
        this.props.learning.every((word) => {
            let mask = ""
            for (let i = 0; i < word.value.length; i++) {
                mask += "*"
            }
            words.push({
                text: word.value,
                img: word.image,
                id: word.wordId,
                example: word.textExample.replace(`${word.value}`, mask + `[${word.value.length}]`),
                raw: word.textExample,
                variant: word.group,
                audio: word.audio,
                hard: word.hard
            })
            return words.length < 20;
        })
        this.setState({questions: words})
    }

    getFromHeader = (group) => {
        const page = +(Math.random() * (30 - 1) + 1).toFixed(0)
        this.props.getWordsByState(group, page)
        this.setState({level: group})
    }

    submit = (e) => {
        e.preventDefault();
        let group = group_variant[+localStorage.getItem("group") - 1]
        if (this.state.level) {
            group = group_variant[this.state.level - 1]
        }
        const answer = e.target.answer.value;
        if (answer === this.state.questions[this.state.page].text) {
            this.setState((prevState) => ({
                page: prevState.page + 1,
                right: true
            }))
            this.props.createWord(
                "learn",
                group,
                this.state.questions[this.state.page].text,
                this.state.questions[this.state.page].id,
                this.state.questions[this.state.page].img,
                this.state.questions[this.state.page].raw,
                this.props.id,
                this.props.token,
                0,
                1,
                this.state.questions[this.state.page].audio,
                this.state.questions[this.state.page].hard
            )
        } else {
            this.setState((prevState) => ({
                page: prevState.page + 1,
                right: false
            }))
            this.props.createWord("learn",
                group,
                this.state.questions[this.state.page].text,
                this.state.questions[this.state.page].id,
                this.state.questions[this.state.page].img,
                this.state.questions[this.state.page].raw,
                this.props.id,
                this.props.token,
                1,
                0,
                this.state.questions[this.state.page].audio,
                this.state.questions[this.state.page].hard
            )
        }
        if (this.state.questions.length - this.state.page === 0) {
            this.setState({endgame: true})
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
            return (((this.state.block) || (this.state.questions.length >= 20)) ? <Container>
                {this.state.endgame ? <>
                    <h3 className="text-center">Конец игры <span>
                     <ButtonGroup>
                    <Link to="/book">
                    <Button variant="info">Вернуться в учебник</Button>
                    </Link>
                    <Link to="/book">
                    <Button variant="info">На главную</Button>
                    </Link>
                </ButtonGroup>
                </span></h3>
                </> : <>
                    <h2 className="text-center">Отгадай слово по картинке и описанию</h2>
                    <Row className="justify-content-center">
                        <Card
                            bg={this.state.questions[this.state.page].variant}
                            key={"ourgame" + this.state.questions[this.state.page].id}
                            text={"light"}
                            className="my-2 mx-2"
                        >
                            <Card.Img variant="top" src={`${BASE_URL}${this.state.questions[this.state.page].img}`}/>
                            <Card.Text className="text-center mt-2">
                                <span
                                    dangerouslySetInnerHTML={{__html: this.state.questions[this.state.page].example}}/>
                            </Card.Text>
                            <Card.Footer>
                                <Form onSubmit={(e) => this.submit(e)}>
                                    <InputGroup>
                                        <Form.Control name="answer" placeholder="Answer"/>
                                        <InputGroup.Append>
                                            <Button variant="success" type="submit">Ответить</Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Form>
                                Осталось слов {this.state.questions.length - this.state.page}
                                {this.state.right !== null ?
                                    this.state.right ? <p className="text-success">Верно</p> :
                                        <p className="text-danger">Неверно</p> : null}
                            </Card.Footer>
                        </Card>
                    </Row>
                </>}
            </Container> : <div className="d-flex justify-content-center align-items-center" style={{minHeight: 374}}>
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createWord: (type, group, value, wordId, image, textExample, userId, token, fail, success, audio, hard) => dispatch(asyncCreateWord(type, group, value, wordId, image, textExample, userId, token, fail, success, audio, hard)),
        getWordsByState: (group, page) => dispatch(asyncGetWords(group, page))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Ourgame);
