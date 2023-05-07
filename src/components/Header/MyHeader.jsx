import React, {useEffect, useState} from "react";
import {Container, Image, Nav, Navbar} from "react-bootstrap";
import Cookies from "universal-cookie/lib";

import logo from "./images/dream-gallery_64.png";
import profile from "./images/profile.png";
import "./MyHeader.css";


/**
 * Шапка сайта
 * @returns {JSX.Element}
 * @constructor
 */
export const MyHeader = () => {
  const [userId, setUserId] = useState("");
  const [cookies,] = useState(new Cookies());

  /**
   * Получает ID пользователя до отрисовки компонента
   */
  useEffect(() => {
    const cookie = cookies.get("User-ID");
    if (cookie) {
      setUserId(cookies.get("User-ID"));
    }
  }, [cookies]);

  return (
      <Navbar className="MyHeader" fixed="top" expand={false}>
        <Container>
          <Navbar.Brand href="/">
            <div className="d-flex align-items-center">
              <Image
                  src={logo}
                  width={50}
              />

              <div className="logo-title ps-2 d-sm-block d-none">Dream Gallery</div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="dream-gallery-navbar">
            <Image
                id="profile-dropdown"
                src={profile}
                width={40}
            />
          </Navbar.Toggle>

          <Navbar.Collapse id="dream-gallery-navbar" className="justify-content-end">
            <Nav className="align-items-center">
              {userId.length !== 0
                  ? (<Nav.Link href="/profile/">Личный кабинет</Nav.Link>)
                  : ""}

              {userId.length !== 0
                  ? (
                      <Nav.Link
                          onClick={event => {
                            event.preventDefault();
                            cookies.remove("User-ID", { path: "/" });
                            window.location = "/login/";
                          }}
                      >
                        Выйти
                      </Nav.Link>
                  )
                  : ""}

              {userId.length === 0
                  ? (<Nav.Link href="/login/">Войти</Nav.Link>)
                  : ""}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}
