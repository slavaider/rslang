import React from "react";
import { Container } from "react-bootstrap";
import rs_logo from "../../assets/icons/rs_logo.svg";
import "./Footer.css";

function Footer() {
  return (
    <div>
      <Container fluid="xl" className="footer__container">
        <a href="https://rs.school/react/">
          <div>
            <img src={rs_logo} className="logo__icon" />
          </div>
        </a>
      </Container>
    </div>
  );
}

export default Footer;
