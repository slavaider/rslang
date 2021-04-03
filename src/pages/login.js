import React from "react";
import {Badge, Button, FormControl, InputGroup, Modal, Spinner} from "react-bootstrap";
import {Login} from "../store/actions/auth";
import {connect} from "react-redux";

class Signin extends React.Component {
    state = {
        show: true
    }

    componentDidMount() {
        if (localStorage.getItem("token")) {
            this.close()
        }
    }

    close = () => {
        this.setState({show: false})
        this.props.history.goBack()
    }

    Login = (e) => {
        e.preventDefault()
        const user = {
            email: e.target.email.value,
            password: e.target.password.value,
        }
        this.props.Login(user)
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.name !== this.props.name) {
            this.close()
        }
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
                    <form onSubmit={this.Login}>
                        <Modal.Header closeButton>
                            <Modal.Title>Войти</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.props.error ? (
                                <p>
                                    <Badge variant="danger">{this.props.error}</Badge>
                                </p>
                            ) : null}
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
                                Войти
                            </Button>
                        </Modal.Footer>
                    </form> :
                    <div className="d-flex justify-content-center align-items-center" style={{minHeight: 374}}>
                        <Spinner size="lg" animation="border" variant="primary"/>
                    </div>
                }
            </Modal>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        Login: (user) => dispatch(Login(user)),
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
