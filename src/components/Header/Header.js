import React from "react";
import {Button, Container, Form, Nav, Navbar, NavDropdown, Spinner} from "react-bootstrap";
import "./Header.css";
import {autoLogin, logout} from "../../store/actions/auth";
import {connect} from "react-redux";
import {Link, NavLink} from "react-router-dom";

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
                    <Navbar expand="xl" style={{backgroundColor: "white"}}>
                        <Navbar.Brand>
                            <Link to="/" className="nav-link">
                                <div className="logo">
                                    <h1 className="logo__school">RS</h1>
                                    <p className="logo__task">Lang</p>
                                </div>
                            </Link>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <NavLink to="about" className="nav__text nav-link">
                                    О проекте
                                </NavLink>

                                <NavLink to="/aboutmethod" className="nav__text nav-link">
                                    Метод интервальных повторений
                                </NavLink>

                                <NavLink to="book" className="nav__text nav-link">
                                    Электронный учебник
                                </NavLink>
                                <NavDropdown
                                    title="Игры"
                                    id="basic-nav-dropdown"
                                    className="nav__text"
                                >
                                    <NavDropdown.Item className="nav__text">
                                        <NavLink to="/games/savanna" className="nav-link">Саванна</NavLink>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item className="nav__text">
                                        <NavLink to="/games/audiogame" className="nav-link">Аудиовызов</NavLink>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item className="nav__text">
                                        <NavLink to="/games/sprint" className="nav-link">Спринт</NavLink>
                                    </NavDropdown.Item>

                                    <NavDropdown.Item className="nav__text">
                                        <NavLink to="/games/ourgame" className="nav-link">Наша игра</NavLink>
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item className="nav__text">
                                        <NavLink to="/games/rules" className="nav-link">Правила игры</NavLink>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item className="nav__text">
                                        <NavLink to="/games/stats" className="nav-link">Статистика</NavLink>
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <NavLink to="/ourteam" className="nav__text nav-link">
                                    Наша команда
                                </NavLink>
                            </Nav>
                            {!this.props.loading ? <Form inline>
                                {this.props.name ?
                                    <>
                                        <h6>{this.props.name}</h6>&nbsp;
                                        <Button variant="outline-danger" className="btn"
                                                onClick={() => this.props.logout()}>
                                            Выйти
                                        </Button>
                                    </>
                                    :
                                    <>
                                        <Link to="/login">
                                            <Button variant="outline-success" className="btn">
                                                Войти
                                            </Button>
                                        </Link>
                                        <Link to="/signin">
                                            <Button variant="outline-success">
                                                Регистрация
                                            </Button>
                                        </Link>
                                    </>
                                }
                            </Form> : <Spinner size="lg" animation="border" variant="primary"/>}
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
        logout: () => dispatch(logout())
    }
}

function mapStateToProps(state) {
    return {
        name: state.auth.name,
        loading: state.loading.loading
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
