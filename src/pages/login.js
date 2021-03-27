import React from "react";
import { useState } from "react";
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";

function Login(props) {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  //const handleShow = () => setShow(true);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Войти</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Электронная почта"
              aria-label="Usermail"
              aria-describedby="user__mail"
            />
          </InputGroup>

          <InputGroup className="mb-1">
            <FormControl
              placeholder="Пароль"
              aria-label="Userpassword"
              aria-describedby="user__password"
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} href="/home">
            Закрыть
          </Button>
          <Button variant="primary">Войти</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Login;
