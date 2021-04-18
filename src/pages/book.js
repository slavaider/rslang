import React from "react";
import {
    Badge,
    Button,
    ButtonGroup,
    Card,
    Col,
    Container,
    Form,
    ListGroup,
    Modal,
    Row,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { BASE_URL } from "../config";
import { asyncSetActions, asyncSetTranslate } from "../store/actions/settings";
import { asyncGetWords } from "../store/actions/book";
import { asyncCreateWord, asyncDeleteWord } from "../store/actions/words";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Spin from "../components/Spin/Spin";
import { group_variant } from "../utils";
import "../styles/book.css";

class Book extends React.Component {
    stats = {
        fail: 0,
        success: 0,
        numbers: 0,
    };
    state = {
        group: 1,
        page: 1,
        learning_page: 1,
        deleted_page: 1,
        hard_page: 1,
        loading: false,
        settings: false,
        volume: 0.5,
    };

    componentDidMount() {
        if (localStorage.getItem("group") && localStorage.getItem("page")) {
            this.setState({
                group: +localStorage.getItem("group"),
                page: +localStorage.getItem("page"),
            });
            this.getWords(
                +localStorage.getItem("group"),
                +localStorage.getItem("page")
            );
        } else {
            this.getWords(this.state.group, this.state.page);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.words !== this.props.words) {
            this.setState({ loading: false });
        }
        if (prevProps.deleted !== this.props.deleted) {
            this.setState({ loading: false });
        }
    }

    // Async getters

    getWords = (group, page) => {
        this.setState({ group, page, loading: true });
        localStorage.setItem("group", group);
        localStorage.setItem("page", page);
        this.props.getWordsByState(group, page);
    };

    // Settings
    settingsShow = () => this.setState({ settings: true });
    settingsClose = () => this.setState({ settings: false });
    Translate = (e) => {
        this.props.setTranslate(
            e.target.checked,
            this.props.id,
            this.props.token
        );
    };
    Actions = (e) => {
        this.props.setActions(
            e.target.checked,
            this.props.id,
            this.props.token
        );
    };

    // Words
    createWord = (
        type,
        word,
        translate,
        word_id,
        image,
        textExample,
        textExampleTranslate,
        group = group_variant[this.state.group - 1],
        audio,
        hard
    ) => {
        this.props.createWord(
            type,
            group,
            word,
            translate,
            word_id,
            image,
            textExample,
            textExampleTranslate,
            this.props.id,
            this.props.token,
            0,
            0,
            audio,
            hard
        );
    };

    deleteWord = (type, wordId) => {
        this.props.deleteWord(type, wordId, this.props.id, this.props.token);
    };
    filterWords = (words) => {
        return words
            .filter(
                (item) =>
                    !this.props.deleted.find((del) => del.wordId === item.id)
            )
            .map((item) => {
                const copy = item;
                copy.hard = !!this.props.hard.find(
                    (hard) => hard.wordId === item.id
                );
                const learn = this.props.learning.find(
                    (learn) => learn.wordId === item.id
                );
                if (learn) {
                    copy.fail = learn.fail;
                    copy.success = learn.success;
                    this.stats.fail += learn.fail;
                    this.stats.success += learn.success;
                    this.stats.numbers += 1;
                }
                return copy;
            });
    };

    playSound = (path, volume = this.state.volume) => {
        const audio = new Audio(path);
        audio.volume = volume;
        audio.play().catch((e) => console.log(e));
    };

    // Render
    render() {
        let filterWords = [];
        if (!this.state.loading) {
            this.stats = {
                fail: 0,
                success: 0,
                numbers: 0,
            };
            filterWords = this.filterWords(this.props.words);
        }
        return (
            <Container>
                {/*Choose Settings and group*/}
                <Row className="justify-content-center">
                    <div className="levels__container-book">
                        {this.props.token ? (
                            <>
                                <div className="level__changer-book">
                                    <Link to="/games/audiogame?book=true">
                                        <Button variant="dark">
                                            Аудиовызов
                                        </Button>
                                    </Link>
                                    <Link to="/games/savanna?book=true">
                                        <Button variant="dark">Саванна</Button>
                                    </Link>
                                    <Link to="/games/sprint?book=true">
                                        <Button variant="dark">Спринт</Button>
                                    </Link>
                                    <Link to="/games/ourgame?book=true">
                                        <Button variant="dark">
                                            Наша игра
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="dark"
                                        onClick={() => this.settingsShow()}
                                    >
                                        Настройки
                                    </Button>
                                    <Modal
                                        show={this.state.settings}
                                        onHide={() => this.settingsClose()}
                                        backdrop="static"
                                        keyboard={false}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>Настройки</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form.Check
                                                defaultChecked={
                                                    this.props.translate
                                                }
                                                onInput={(e) =>
                                                    this.Translate(e)
                                                }
                                                type="checkbox"
                                                label="Перевод"
                                            />
                                            <hr />
                                            <Form.Check
                                                defaultChecked={
                                                    this.props.actions
                                                }
                                                onInput={(e) => this.Actions(e)}
                                                type="checkbox"
                                                label="Добавить кнопки 'Сложное слово' и 'Удалить'"
                                            />
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button
                                                variant="dark"
                                                onClick={() =>
                                                    this.settingsClose()
                                                }
                                            >
                                                Закрыть
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                            </>
                        ) : null}
                        <h3 className="book__group">Book Group:</h3>
                        <ButtonGroup className="mx-2 my-2">
                            <Button
                                onClick={() => this.getWords(1, 1)}
                                active={this.state.group === 1}
                                variant="outline-dark"
                            >
                                1
                            </Button>
                            <Button
                                onClick={() => this.getWords(2, 1)}
                                active={this.state.group === 2}
                                variant="outline-info"
                            >
                                2
                            </Button>
                            <Button
                                onClick={() => this.getWords(3, 1)}
                                active={this.state.group === 3}
                                variant="outline-success"
                            >
                                3
                            </Button>
                            <Button
                                onClick={() => this.getWords(4, 1)}
                                active={this.state.group === 4}
                                variant="outline-primary"
                            >
                                4
                            </Button>
                            <Button
                                onClick={() => this.getWords(5, 1)}
                                active={this.state.group === 5}
                                variant="outline-secondary"
                            >
                                5
                            </Button>
                            <Button
                                onClick={() => this.getWords(6, 1)}
                                active={this.state.group === 6}
                                variant="outline-danger"
                            >
                                6
                            </Button>
                        </ButtonGroup>
                    </div>
                </Row>
                {/*Book*/}
                {!this.state.loading ? (
                    <Row className="justify-content-center">
                        {filterWords.length === 0 ? (
                            <h2>Страница учебника пуста</h2>
                        ) : (
                            filterWords.map((item) => {
                                return (
                                    <Card
                                        bg={
                                            item.hard
                                                ? "warning"
                                                : group_variant[
                                                      this.state.group - 1
                                                  ]
                                        }
                                        key={item.id}
                                        text={"light"}
                                        style={{ width: "15rem" }}
                                        className="my-2 mx-2"
                                    >
                                        <Card.Img
                                            variant="top"
                                            src={`${BASE_URL}${item.image}`}
                                        />
                                        <Card.Header>
                                            {item.word}&nbsp;
                                            {item.transcription}&nbsp;
                                            <span
                                                title="Воспроизвести"
                                                className="audio__icon"
                                                onClick={() => this.playSound(`${BASE_URL}${item.audio}`)}
                                            />
                                        </Card.Header>

                                        <Card.Body>
                                            {typeof item.success ===
                                            "number" ? (
                                                <Card.Text>
                                                    Отгадано: {item.success}{" "}
                                                    <br />
                                                    Не отгадано: {item.fail}
                                                </Card.Text>
                                            ) : null}
                                            {item.hard ? (
                                                <Card.Text>
                                                    Сложное слово
                                                </Card.Text>
                                            ) : null}
                                            {this.props.translate ? (
                                                <Card.Text>
                                                    перевод:{" "}
                                                    {item.wordTranslate}
                                                </Card.Text>
                                            ) : null}

                                            <Card.Text>
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            item.textMeaning,
                                                    }}
                                                />
                                                <span
                                                    title="Воспроизвести"
                                                    className="audio__icon"
                                                    onClick={() => this.playSound(`${BASE_URL}${item.audioMeaning}`)}
                                                />
                                                {this.props.translate
                                                    ? item.textMeaningTranslate
                                                    : null}
                                            </Card.Text>
                                            <Card.Text>
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            item.textExample,
                                                    }}
                                                />
                                                <span
                                                    title="Воспроизвести"
                                                    className="audio__icon"
                                                    onClick={() => this.playSound(`${BASE_URL}${item.audioExample}`)}
                                                />
                                                {this.props.translate
                                                    ? item.textExampleTranslate
                                                    : null}
                                            </Card.Text>
                                        </Card.Body>
                                        {this.props.actions &&
                                        this.props.token ? (
                                            <Card.Subtitle className="ml-2 mb-2">
                                                <ButtonGroup>
                                                    <Button
                                                        onClick={() =>
                                                            this.createWord(
                                                                "learn",
                                                                item.word,
                                                                item.wordTranslate,
                                                                item.id,
                                                                item.image,
                                                                item.textExample,
                                                                item.textExampleTranslate,
                                                                group_variant[
                                                                    this.state
                                                                        .group -
                                                                        1
                                                                ],
                                                                item.audio,
                                                                true
                                                            )
                                                        }
                                                        size="sm"
                                                    >
                                                        Сложное слово
                                                    </Button>
                                                    <Button
                                                        variant={
                                                            item.hard
                                                                ? "danger"
                                                                : "warning"
                                                        }
                                                        onClick={() =>
                                                            this.createWord(
                                                                "delete",
                                                                item.word,
                                                                item.wordTranslate,
                                                                item.id
                                                            )
                                                        }
                                                        size="sm"
                                                    >
                                                        Удалить
                                                    </Button>
                                                </ButtonGroup>
                                            </Card.Subtitle>
                                        ) : null}
                                    </Card>
                                );
                            })
                        )}
                    </Row>
                ) : (
                    <Spin />
                )}
                {/*Pagination for Book*/}
                <Row className="justify-content-center align-items-center">
                    <ReactPaginate
                        containerClassName={"pagination"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        activeClassName={"active"}
                        // Prev
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        previousLabel={"<"}
                        // Next
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        nextLabel={">"}
                        // Break
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        breakLabel={"..."}
                        // Count
                        pageCount={30}
                        pageRangeDisplayed={3}
                        forcePage={this.state.page - 1}
                        // Actions
                        onPageChange={(e) =>
                            this.getWords(this.state.group, e.selected + 1)
                        }
                    />
                </Row>
                {this.props.token ? (
                    <>
                        {/*Stats*/}
                        <Row className="justify-content-center align-items-center">
                            <div className="stats__container">
                                <h3 className="stats__title">
                                    Статистика по словам:
                                </h3>
                                <div className="book__stats">
                                    <p className="stats__items">
                                        Количество изучаемых слов:
                                        {this.stats.numbers}
                                    </p>
                                    <p className="stats__items true">
                                        Верно названо: {this.stats.success}
                                    </p>
                                    <p className="stats__items false">
                                        Неверно названо: {this.stats.fail}
                                    </p>
                                </div>
                            </div>
                        </Row>
                        {/*Learning Words*/}
                        <Row className="justify-content-center align-items-center">
                            <h2 className="words__learning">Изучаемые слова</h2>
                            <Col xs={12}>
                                {this.props.learning.length === 0 ? (
                                    <ListGroup.Item>
                                        Нет изучаемых слов
                                    </ListGroup.Item>
                                ) : (
                                    <div className="words__table">
                                        <div className="table__learning">
                                            <span className="column__items book">
                                                Изучаемое слово
                                            </span>
                                            <span className="column__items book">
                                                Количество верно названных
                                            </span>
                                            <span className="column__items book">
                                                Количество неверно названных
                                            </span>
                                        </div>
                                        <ListGroup>
                                            {this.props.learning
                                                .slice(
                                                    (this.state.learning_page -
                                                        1) *
                                                        20,
                                                    this.state.learning_page *
                                                        20
                                                )
                                                .map((item) => {
                                                    return (
                                                        <ListGroup.Item
                                                            key={
                                                                "learn " +
                                                                item.wordId
                                                            }
                                                            variant={item.group}
                                                        >
                                                            <div className="d-flex justify-content-between">
                                                                <div className="word__row">
                                                                    <span className="word__learning">
                                                                        {
                                                                            item.value
                                                                        }
                                                                    </span>
                                                                    <Badge variant="success">
                                                                        <span className="word__true">
                                                                            {
                                                                                item.success
                                                                            }
                                                                        </span>
                                                                    </Badge>{" "}
                                                                    <Badge variant="danger">
                                                                        <span className="word__false">
                                                                            {
                                                                                item.fail
                                                                            }
                                                                        </span>
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </ListGroup.Item>
                                                    );
                                                })}
                                        </ListGroup>
                                    </div>
                                )}
                            </Col>
                            <ReactPaginate
                                containerClassName={"pagination my-2"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                activeClassName={"active"}
                                // Prev
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                previousLabel={"<"}
                                // Next
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                                nextLabel={">"}
                                // Break
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link"}
                                breakLabel={"..."}
                                // Count
                                pageCount={Math.ceil(
                                    this.props.learning.length / 20
                                )}
                                pageRangeDisplayed={3}
                                // Actions
                                onPageChange={(e) =>
                                    this.setState({
                                        learning_page: e.selected + 1,
                                    })
                                }
                            />
                        </Row>

                        {/*Hard words*/}

                        <Row className="justify-content-center">
                            <h2>Сложные слова</h2>
                            <Col xs={12}>
                                {this.props.hard.length === 0 ? (
                                    <ListGroup.Item>
                                        Нет сложных слов
                                    </ListGroup.Item>
                                ) : (
                                    <ListGroup>
                                        {this.props.hard
                                            .slice(
                                                (this.state.hard_page - 1) * 20,
                                                this.state.hard_page * 20
                                            )
                                            .map((item) => {
                                                return (
                                                    <ListGroup.Item
                                                        key={
                                                            "hard " +
                                                            item.wordId
                                                        }
                                                        variant={item.group}
                                                    >
                                                        {item.value}
                                                        <Button
                                                            onClick={() =>
                                                                this.createWord(
                                                                    "learn",
                                                                    item.value,
                                                                    item.translate,
                                                                    item.wordId,
                                                                    item.image,
                                                                    item.textExample,
                                                                    item.textExampleTranslate,
                                                                    item.group,
                                                                    item.audio,
                                                                    false
                                                                )
                                                            }
                                                            variant="success"
                                                            className="float-right"
                                                        >
                                                            Восстановить
                                                        </Button>
                                                    </ListGroup.Item>
                                                );
                                            })}
                                    </ListGroup>
                                )}
                            </Col>
                            <ReactPaginate
                                containerClassName={"pagination my-2"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                activeClassName={"active"}
                                // Prev
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                previousLabel={"<"}
                                // Next
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                                nextLabel={">"}
                                // Break
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link"}
                                breakLabel={"..."}
                                // Count
                                pageCount={Math.ceil(
                                    this.props.hard.length / 20
                                )}
                                pageRangeDisplayed={10}
                                // Actions
                                onPageChange={(e) =>
                                    this.setState({ hard_page: e.selected + 1 })
                                }
                            />
                        </Row>

                        {/*Deleted Words*/}

                        <Row className="justify-content-center">
                            <h2>Удалённые слова</h2>
                            <Col xs={12}>
                                {this.props.deleted.length === 0 ? (
                                    <ListGroup.Item>
                                        Нет удалённых слов
                                    </ListGroup.Item>
                                ) : (
                                    <ListGroup>
                                        {this.props.deleted
                                            .slice(
                                                (this.state.deleted_page - 1) *
                                                    20,
                                                this.state.deleted_page * 20
                                            )
                                            .map((item) => {
                                                return (
                                                    <ListGroup.Item
                                                        key={
                                                            "deleted " +
                                                            item.wordId
                                                        }
                                                        variant={item.group}
                                                    >
                                                        {item.value}
                                                        <Button
                                                            onClick={() =>
                                                                this.deleteWord(
                                                                    item.type,
                                                                    item.wordId
                                                                )
                                                            }
                                                            variant="success"
                                                            className="float-right"
                                                        >
                                                            Восстановить
                                                        </Button>
                                                    </ListGroup.Item>
                                                );
                                            })}
                                    </ListGroup>
                                )}
                            </Col>
                            <ReactPaginate
                                containerClassName={"pagination my-2"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                activeClassName={"active"}
                                // Prev
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                previousLabel={"<"}
                                // Next
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                                nextLabel={">"}
                                // Break
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link"}
                                breakLabel={"..."}
                                // Count
                                pageCount={Math.ceil(
                                    this.props.deleted.length / 20
                                )}
                                pageRangeDisplayed={10}
                                // Actions
                                onPageChange={(e) =>
                                    this.setState({
                                        deleted_page: e.selected + 1,
                                    })
                                }
                            />
                        </Row>
                    </>
                ) : null}
            </Container>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getWordsByState: (group, page) => dispatch(asyncGetWords(group, page)),
        setTranslate: (value, id, token) =>
            dispatch(asyncSetTranslate(value, id, token)),
        setActions: (value, id, token) =>
            dispatch(asyncSetActions(value, id, token)),
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
        deleteWord: (type, wordId, userId, token) =>
            dispatch(asyncDeleteWord(type, wordId, userId, token)),
    };
}

function mapStateToProps(state) {
    return {
        words: state.book.words,
        translate: state.settings.translate,
        actions: state.settings.actions,
        token: state.auth.token,
        id: state.auth.id,
        learning: state.words.learning,
        deleted: state.words.deleted,
        hard: state.words.hard,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Book);
