import React from "react";
import {Container} from "react-bootstrap";
import {connect} from "react-redux";
import {asyncCreateWord} from "../store/actions/words";
import {withRouter} from "react-router-dom";

class Ourgame extends React.Component {

    state = {
        questions: [],
        page: 1
    }

    componentDidMount() {
        // const group = localStorage.getItem("group")
        // const page = localStorage.getItem("page")
        console.log(this.props.location.search)
    }

    render() {
        return (<Container>
            <button onClick={() => this.next()}>next</button>
        </Container>)
    }

}

function mapStateToProps(state) {
    return {
        learning: state.words.learning,
        words: state.book.words,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createWord: (type, group, value, wordId, userId, token, fail, success) => dispatch(asyncCreateWord(type, group, value, wordId, userId, token, fail, success)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Ourgame));
