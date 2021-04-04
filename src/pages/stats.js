import React from "react";
import {connect} from "react-redux";
import {asyncGetStats} from "../store/actions/stats";
import {Button} from "react-bootstrap";

class Stats extends React.Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.id !== this.props.id) {
            this.props.getStats(this.props.id, this.props.token);
        }
    }

    render() {
        console.log(this.props.stats)
        return (
            <Button variant="success">up</Button>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getStats: (id, token) => dispatch(asyncGetStats(id, token))
    }
}

function mapStateToProps(state) {
    return {
        stats: state.stats.statistic,
        id: state.auth.id,
        token: state.auth.token,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stats)
