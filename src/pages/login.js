import React from "react";
import {Badge, Button, FormControl, InputGroup, Modal, Spinner} from "react-bootstrap";
import {Login} from "../store/actions/auth";
import {connect} from "react-redux";

class Signin extends React.Component {
  state = {
    show: true
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.props.history.push('/')
    }
  }

  close = () => this.setState({show: false})

  Login = (e) => {
    e.preventDefault()
    const user = {
      email: e.target.email.value,
      password: e.target.password.value,
    }
    this.props.Login(user)
    if(!this.props.loading && this.props.error===null){
      this.props.history.push('/')
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
                  <Button variant="secondary" onClick={this.close} href="/home">
                    Закрыть
                  </Button>
                  <Button variant="primary" type="submit">
                    Войти
                  </Button>
                </Modal.Footer>
              </form> : <Spinner size="lg" animation="border" variant="primary"/>
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
    loading: state.loading.loading,
    error: state.loading.error,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
