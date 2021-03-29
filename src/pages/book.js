import React from "react";
import {connect} from "react-redux";
import {Button, ButtonGroup, Card, Container, Row, Spinner} from "react-bootstrap";
import ReactPaginate from 'react-paginate';
import {asyncGetWords} from "../store/actions/book";
import {BASE_URL} from "../config";

const group_variant = ['dark', 'info', 'success', 'primary', 'secondary', 'danger']

class Book extends React.Component {
    state = {
        group: 1,
        page: 1,
        loading: false
    }

    componentDidMount() {
        if (localStorage.getItem('group') && localStorage.getItem('page')) {
            this.setState({
                group: +localStorage.getItem('group'),
                page: +localStorage.getItem('page')
            });
            this.getWords(+localStorage.getItem('group'), +localStorage.getItem('page'));
        } else {
            this.getWords(this.state.group, this.state.page);
        }
    }

    getWords = (group, page) => {
        this.setState({group, page, loading: true})
        localStorage.setItem('group', group);
        localStorage.setItem('page', page);
        this.props.getWordsByState(group, page)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.words !== this.props.words) {
            this.setState({loading: false})
        }
    }


    render() {
        return (
            <Container>
                <Row className="justify-content-center">
                    <h3>
                        Book Group:
                    </h3>
                    <ButtonGroup className='ml-2'>
                        <Button onClick={() => this.getWords(1, 1)} active={this.state.group === 1}
                                variant="outline-dark">1</Button>
                        <Button onClick={() => this.getWords(2, 1)} active={this.state.group === 2}
                                variant="outline-info">2</Button>
                        <Button onClick={() => this.getWords(3, 1)} active={this.state.group === 3}
                                variant="outline-success">3</Button>
                        <Button onClick={() => this.getWords(4, 1)} active={this.state.group === 4}
                                variant="outline-primary">4</Button>
                        <Button onClick={() => this.getWords(5, 1)} active={this.state.group === 5}
                                variant="outline-secondary">5</Button>
                        <Button onClick={() => this.getWords(6, 1)} active={this.state.group === 6}
                                variant="outline-danger">6</Button>
                    </ButtonGroup>
                </Row>

                {!this.state.loading ?
                    <Row>
                        {this.props.words.map((item) => {
                            return (
                                <Card
                                    bg={group_variant[this.state.group - 1]}
                                    key={item.id}
                                    text={'light'}
                                    style={{width: '15rem'}}
                                    className="my-2 mx-2"
                                >
                                    <Card.Img variant="top" src={`${BASE_URL}${item.image}`}/>

                                    <Card.Header>
                                        {item.word}&nbsp;{item.transcription}&nbsp;
                                        <span>
                                            <audio controls={true} src={`${BASE_URL}${item.audio}`}/>
                                        </span>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Text>
                                            перевод: {item.wordTranslate}
                                            <hr/>
                                        </Card.Text>
                                        <Card.Text>
                                            <span dangerouslySetInnerHTML={{__html: item.textMeaning}}/>
                                            <span>
                                                <audio
                                                    controls={true}
                                                    src={`${BASE_URL}${item.audioMeaning}`}/>
                                             </span>
                                            {item.textMeaningTranslate}
                                            <hr/>
                                        </Card.Text>
                                        <Card.Text>
                                            <span dangerouslySetInnerHTML={{__html: item.textExample}}/>
                                            <span>
                                                <audio controls={true} src={`${BASE_URL}${item.audioExample}`}/>
                                            </span>
                                            {item.textExampleTranslate}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </Row> : <div className="d-flex justify-content-center align-items-center" style={{minHeight: 374}}>
                        <Spinner size="lg" animation="border" variant="primary"/>
                    </div>}
                <Row className="justify-content-center">
                    <ReactPaginate
                        containerClassName={'pagination'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        activeClassName={'active'}
                        // Prev
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        previousLabel={'<'}
                        // Next
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        nextLabel={'>'}
                        // Break
                        breakClassName={'page-item'}
                        breakLinkClassName={'page-link'}
                        breakLabel={'...'}
                        // Count
                        pageCount={30}
                        pageRangeDisplayed={10}
                        forcePage={this.state.page - 1}
                        // Actions
                        onPageChange={(e) => this.getWords(this.state.group, e.selected + 1)}
                    />
                </Row>
            </Container>
        )
    }

}

function mapDispatchToProps(dispatch) {
    return {
        getWordsByState: (group, page) => dispatch(asyncGetWords(group, page)),
    }
}

function mapStateToProps(state) {
    return {
        words: state.book.words,
        error: state.loading.error,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Book)
