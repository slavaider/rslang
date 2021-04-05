import React from "react";
import {connect} from "react-redux";
import {Container, ListGroupItem} from "react-bootstrap";
import Spin from "../components/Spin/Spin";

class Stats extends React.Component {


    getPercent = (value) => {
        const success = value.audio.success + value.savanna.success + value.sprint.success + value.our.success;
        return ((success / value.wordPerDay) * 100).toFixed(2)
    }

    render() {
        return (
            <Container className="text-center">
                {this.props.stats ? <>
                    <h1>Статистика</h1>
                    {Object.keys(this.props.stats.optional).map((date) => {
                        return (
                            <React.Fragment key={date}>
                                <h3>{date}</h3>
                                {Object.keys(this.props.stats.optional[date]).map((key) => {
                                    return (
                                        <React.Fragment key={key}>
                                            {key === "wordPerDay" ?
                                                <>
                                                    <h4>Процент правильных
                                                        ответов: {this.getPercent(this.props.stats.optional[date])}%</h4>
                                                    <h4>Слов в день:{this.props.stats.optional[date][key]}</h4></> :
                                                <ListGroupItem variant="info"
                                                               className="d-flex justify-content-between">
                                                    <div>
                                                        {key === "savanna" ? "Саванна" : null}
                                                        {key === "sprint" ? "Спринт" : null}
                                                        {key === "audio" ? "Аудиовызов" : null}
                                                        {key === "our" ? "Наша игра" : null}
                                                    </div>
                                                    <div>
                                                        Выполнено
                                                        слов: {this.props.stats.optional[date][key].count}&nbsp;
                                                        Правильно
                                                        отгадано: {this.props.stats.optional[date][key].success}&nbsp;
                                                        Наибольшая
                                                        серия: {this.props.stats.optional[date][key].series}&nbsp;
                                                    </div>
                                                </ListGroupItem>
                                            }
                                        </React.Fragment>
                                    )
                                })}
                            </React.Fragment>
                        )
                    })}
                </> : <Spin/>}
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        stats: state.stats.statistic
    }
}

export default connect(mapStateToProps, null)(Stats)
