import React from "react";
import {Form, Image} from "react-bootstrap";

import logo from "../../images/dream-gallery-512.png";
import "./register.css";


/**
 * Страница регистрации
 * @returns {JSX.Element}
 * @constructor
 */
export const Register = () => {
  return (
      <div className="centered-form-wrapper">
        <Form className="centered-form">
          <div className="text-center">
            <a className="" href="/">
              <Image
                  className="form-logo"
                  src={logo}
              />

              <h1>Dream Gallery</h1>
            </a>
          </div>

          <Form.Group className="mb-3" controlId="firstname">
            <Form.Label>Имя</Form.Label>
            <Form.Control
                type="text"
                placeholder="Ваше имя"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="lastname">
            <Form.Label>Фамилия</Form.Label>
            <Form.Control
                type="text"
                placeholder="Ваша фамилия"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Логин</Form.Label>
            <Form.Control
                type="text"
                placeholder="Ваш логин"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
                type="email"
                placeholder="Ваш email"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
                type="password"
                placeholder="Ваш пароль"
            />
          </Form.Group>

          <Form.Group className="text-center">
            <button
                className="button"
                type="submit"
                name="register"
            >
              Зарегистрироваться
            </button>
          </Form.Group>
        </Form>
      </div>
  );
}
