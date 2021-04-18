import React from "react";
import { Container } from "react-bootstrap";
import rs_logo from "../../assets/icons/rs_logo.svg";
import slavaider from "../../assets/icons/slavaider.jpg";
import victor from "../../assets/icons/victor.jpg";
import "./Footer.css";

function Footer() {
  return (
    <div>
      <Container fluid="xl">
        <div className="footer__content">
          <a href="https://rs.school/react/">
            <div>
              <img alt="logo" src={rs_logo} className="logo__icon" />
            </div>
          </a>
          <p className="footer__text">2021</p>
          <a href="https://github.com/slavaider">
            <div>
              <img alt="logo" src={slavaider} className="logo__slavaider" />
            </div>
          </a>

          <a href="https://github.com/VVK1978">
            <div>
              <img alt="logo" src={victor} className="logo__victor" />
            </div>
          </a>
        </div>
      </Container>
    </div>
  );
}

export default Footer;
