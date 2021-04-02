import React from "react";
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Spinner,
} from "react-bootstrap";
import "./Header.css";
import { autoLogin, logout } from "../../store/actions/auth";
import { connect } from "react-redux";

class Header extends React.Component {
  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.props.autoLogin(
        localStorage.getItem("user_id"),
        localStorage.getItem("token")
      );
    }
  }

  render() {
    return (
      <div>
        <Container fluid="xl">
          <Navbar
            expand="xl"
            style={{ backgroundColor: "white"}}
          >
            <Navbar.Brand href="/">
              <div className="logo">
                <h1 className="logo__school">RS</h1>
                <p className="logo__task">Lang</p>
              </div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/about" className="nav__text">
                  О проекте
                </Nav.Link>
                <Nav.Link href="/aboutmethod" className="nav__text">
                  Метод интервальных повторений
                </Nav.Link>
                <Nav.Link href="/book" className="nav__text">
                  Электронный учебник
                </Nav.Link>
                <NavDropdown
                  title="Игры"
                  id="basic-nav-dropdown"
                  className="nav__text"
                >
                  <NavDropdown.Item href="/games/savanna" className="nav__text">
                    Саванна
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/games/audiogame"
                    className="nav__text"
                  >
                    Аудиовызов
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/games/sprint" className="nav__text">
                    Спринт
                  </NavDropdown.Item>

                  <NavDropdown.Item href="/games/ourgame" className="nav__text">
                    Наша игра
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/games/rules" className="nav__text">
                    Правила игры
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/games/stats" className="nav__text">
                    Статистика
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/ourteam" className="nav__text">
                  Наша команда
                </Nav.Link>
              </Nav>
              {!this.props.loading ? (
                <Form inline>
                  {this.props.name ? (
                    <>
                      <h6>{this.props.name}</h6>&nbsp;
                      <Button
                        variant="outline-danger"
                        className="btn"
                        onClick={() => this.props.logout()}
                      >
                        Выйти
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline-success"
                        className="btn"
                        href="/login"
                      >
                        Войти
                      </Button>
                      <Button variant="outline-success" href="/signin">
                        Регистрация
                      </Button>
                    </>
                  )}
                </Form>
              ) : (
                <Spinner size="lg" animation="border" variant="primary" />
              )}
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    autoLogin: (id, token) => dispatch(autoLogin(id, token)),
    logout: () => dispatch(logout()),
  };
}

function mapStateToProps(state) {
  return {
    name: state.auth.name,
    loading: state.loading.loading,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
