import React from "react";
import {Button, Card, Container, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {connect} from "react-redux";
import {asyncCreateWord} from "../store/actions/words";
import {withRouter} from "react-router-dom"
import {BASE_URL} from "../config";


const group_variant = ["dark", "info", "success", "primary", "secondary", "danger"]


class Ourgame extends React.Component {

    state = {
        questions: [],
        question: {},
        page: 1,
        loading: true,
        right: null,
        endgame: false
    }


    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search)
        const from = !!query.get("book")
        if (from && this.props.learning.length !== 0) {
            this.getFromLearning()
        }
        // if (from && this.props.words.length !== 0) {
        //     const words = []
        //     this.props.words.forEach((word) => {
        //         if (!this.props.learning.includes((el) => el.wordId === word.id)) {
        //             this.props.createWord("learn",
        //                 group_variant[+localStorage.getItem("group") - 1],
        //                 word.word,
        //                 word.id,
        //                 this.props.id,
        //                 this.props.token,
        //                 0,
        //                 0)
        //             let mask = ""
        //             for (let i = 0; i < word.word.length; i++) {
        //                 mask += "*"
        //             }
        //             words.push({
        //                 text: word.word,
        //                 img: word.image,
        //                 id: word.id,
        //                 example: word.textExample.replace(`${word.word}`, mask + `[${word.word.length}]`),
        //                 variant: group_variant[+localStorage.getItem("group") - 1],
        //             })
        //         }
        //     })
        //     this.setState({questions: [...this.state.questions, words]})
        // }
    }

    getFromLearning = () => {
        const words = []
        this.props.learning.forEach((word) => {
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
            })
        })
        this.setState({questions: words})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.questions !== this.state.questions) {
            this.setState({loading: false, question: this.state.questions[0]})
        }
        if (prevProps.learning !== this.props.learning) {
            this.getFromLearning()
        }
    }

    submit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const answer = e.target.answer.value;
        if (answer === this.state.question.text) {
            this.setState((prevState) => ({
                page: prevState.page + 1,
                question: prevState.questions[prevState.page + 1],
                right: true
            }))
            this.props.createWord("learn",
                group_variant[+localStorage.getItem("group") - 1],
                this.state.question.text,
                this.state.question.id,
                this.state.question.img,
                this.state.question.raw,
                this.props.id,
                this.props.token,
                0,
                1)
        } else {
            this.setState((prevState) => ({
                page: prevState.page + 1,
                question: prevState.questions[prevState.page + 1],
                right: false
            }))
            this.props.createWord("learn",
                group_variant[+localStorage.getItem("group") - 1],
                this.state.question.text,
                this.state.question.id,
                this.state.question.img,
                this.state.question.raw,
                this.props.id,
                this.props.token,
                1,
                0
            )
        }
        if (this.state.questions.length - this.state.page === 0) {
            this.setState({endgame: true})
        }
    }

    render() {
        return (this.state.questions.length !== 0 && this.props.id !== null ? <Container>
            {this.state.endgame ? <p>Конец игры</p> : <>
                <h2 className="text-center">Отгадай слово по картинке и описанию</h2>
                <Row className="justify-content-center">
                    <Card
                        bg={this.state.question.variant}
                        key={"ourgame" + this.state.question.id}
                        text={"light"}
                        className="my-2 mx-2"
                    >
                        <Card.Img variant="top" src={`${BASE_URL}${this.state.question.img}`}/>
                        <Card.Text className="text-center mt-2">
                            <span dangerouslySetInnerHTML={{__html: this.state.question.example}}/>
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
                            Осталось слов {this.state.questions.length - this.state.page + 1}
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
        words: state.book.words,
        id: state.auth.id,
        token: state.auth.token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createWord: (type, group, value, wordId, image, textExample, userId, token, fail, success) => dispatch(asyncCreateWord(type, group, value, wordId, image, textExample, userId, token, fail, success)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Ourgame));
