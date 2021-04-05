import React from "react";
import {Badge, Button, FormControl, InputGroup, Modal} from "react-bootstrap";
import {Register} from "../store/actions/auth";
import {connect} from "react-redux";
import Spin from "../components/Spin/Spin";

class Signin extends React.Component {
    state = {
        show: true
    }

    componentDidMount() {
        if (localStorage.getItem("token")) {
            this.close()
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.name !== this.props.name) {
            this.close()
        }
    }

    close = () => {
        this.setState({show: false})
        this.props.history.goBack()
    }
    Register = (e) => {
        e.preventDefault()
        const user = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value,
        }
        this.props.register(user)
    }


    render() {
        return (
            <Modal
                show={this.state.show}
                onHide={this.close}
                backdrop="static"
                keyboard={false}
            >
                {!this.props.loading ?
                    <form onSubmit={this.Register}>
                        <Modal.Header closeButton>
                            <Modal.Title>Регистрация</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.props.error ? (
                                <p>
                                    <Badge variant="danger">{this.props.error}</Badge>
                                </p>
                            ) : null}
                            <InputGroup className="mb-3">
                                <FormControl
                                    name="name"
                                    placeholder="Имя"
                                    aria-label="Username"
                                    aria-describedby="user__name"
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <FormControl
                                    name="email"
                                    placeholder="Электронная почта"
                                    aria-label="Usermail"
                                    aria-describedby="user__mail"
                                />
                            </InputGroup>

                            <InputGroup className="mb-3">
                                <FormControl
                                    name="password"
                                    placeholder="Пароль"
                                    aria-label="Userpassword"
                                    aria-describedby="user__password"
                                />
                            </InputGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.close}>
                                Закрыть
                            </Button>
                            <Button variant="primary" type="submit">
                                Зарегистрироваться
                            </Button>
                        </Modal.Footer>
                    </form> :
                    <Spin/>
                }
            </Modal>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        register: (user) => dispatch(Register(user)),
    }
}

function mapStateToProps(state) {
    return {
        name: state.auth.name,
        loading: state.loading.loading,
        error: state.loading.error,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
