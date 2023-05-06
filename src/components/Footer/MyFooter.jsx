import React from "react";
import {Col, Container, Image, Row} from "react-bootstrap";

import logo from "./images/dream-gallery_64.png";
import "./MyFooter.css";


/**
 * Подвал сайта
 * @returns {JSX.Element}
 * @constructor
 */
export const MyFooter = () => {
  return (
      <footer className="MyFooter py-3">
        <Container>
          <div className="footer-logo text-center pb-4">
            <a href="/">
              <Image
                  src={logo}
                  width={50}
              />
              {/*<div className="footer-logo-title">Dream Gallery</div>*/}
            </a>
          </div>

          <Row className="position-relative">
            <Col
                xs={6}
                sm={6}
                md={6}
                lg={6}
                className="pe-4"
            >
              <div className="line"></div>
            </Col>

            <div className="round"></div>

            <Col
                xs={6}
                sm={6}
                md={6}
                lg={6}
                className="ps-4"
            >
              <div className="line"></div>
            </Col>
          </Row>

          <div className="copyright text-center pt-3">
            &copy; Dream Gallery &mdash; Все права защищены
          </div>
        </Container>
      </footer>
  );
}
