import React from "react";
import { connect } from "react-redux";
import { Container, ListGroupItem } from "react-bootstrap";
import Spin from "../components/Spin/Spin";
import "../styles/stats.css";

class Stats extends React.Component {
    getPercent = (value) => {
        const success =
            value.audio.success +
            value.savanna.success +
            value.sprint.success +
            value.our.success;
        if (value.wordPerDay === 0) return 0;
        return ((success / value.wordPerDay) * 100).toFixed(2);
    };

    render() {
        return (
            <Container className="text-center">
                {this.props.stats ? (
                    <>
                        <h1>Статистика за:</h1>
                        {Object.keys(this.props.stats.optional).map((date) => {
                            return (
                                <React.Fragment key={date}>
                                    <h3>{date}</h3>
                                    {Object.keys(
                                        this.props.stats.optional[date]
                                    ).map((key) => {
                                        return (
                                            <React.Fragment key={key}>
                                                {key === "wordPerDay" ? (
                                                    <>
                                                        <h4>
                                                            Процент правильных
                                                            ответов:{" "}
                                                            {this.getPercent(
                                                                this.props.stats
                                                                    .optional[
                                                                    date
                                                                ]
                                                            )}
                                                            %
                                                        </h4>
                                                        <h4>
                                                            Всего слов за день:
                                                            {
                                                                this.props.stats
                                                                    .optional[
                                                                    date
                                                                ][key]
                                                            }
                                                        </h4>
                                                        <div className="header">
                                                            <div className="column__property">
                                                                Название игры
                                                            </div>
                                                            <div className="column__property">
                                                                Количество слов
                                                            </div>
                                                            <div className="column__property">
                                                                Правильно
                                                                названо
                                                            </div>
                                                            <div className="column__property">
                                                                Наибольшая серия
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ListGroupItem
                                                            variant="info"
                                                            className="d-flex justify-content-between"
                                                        >
                                                            <div className="games__stats">
                                                                <div>
                                                                    {key ===
                                                                    "savanna"
                                                                        ? "Саванна"
                                                                        : null}
                                                                    {key ===
                                                                    "sprint"
                                                                        ? "Спринт"
                                                                        : null}
                                                                    {key ===
                                                                    "audio"
                                                                        ? "Аудиовызов"
                                                                        : null}
                                                                    {key ===
                                                                    "our"
                                                                        ? "Наша игра"
                                                                        : null}
                                                                </div>
                                                                <div className="table__stats">
                                                                    <div className="table__items">
                                                                        {
                                                                            this
                                                                                .props
                                                                                .stats
                                                                                .optional[
                                                                                date
                                                                            ][
                                                                                key
                                                                            ]
                                                                                .count
                                                                        }
                                                                    </div>
                                                                    <div className="table__items">
                                                                        {
                                                                            this
                                                                                .props
                                                                                .stats
                                                                                .optional[
                                                                                date
                                                                            ][
                                                                                key
                                                                            ]
                                                                                .success
                                                                        }
                                                                    </div>
                                                                    <div className="table__items">
                                                                        {
                                                                            this
                                                                                .props
                                                                                .stats
                                                                                .optional[
                                                                                date
                                                                            ][
                                                                                key
                                                                            ]
                                                                                .series
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </ListGroupItem>
                                                    </>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </>
                ) : (
                    <Spin />
                )}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        stats: state.stats.statistic,
    };
}

export default connect(mapStateToProps, null)(Stats);
