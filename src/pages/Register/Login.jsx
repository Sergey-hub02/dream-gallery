import React from "react";
import {Form, Image} from "react-bootstrap";
import "./register.css";
import logo from "../../images/dream-gallery-512.png";


/**
 * Страница авторизации
 * @returns {JSX.Element}
 * @constructor
 */
export const Login = () => {
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

          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Логин</Form.Label>
            <Form.Control
                type="text"
                placeholder="Ваш логин"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
                type="password"
                placeholder="Ваш пароль"
            />
          </Form.Group>

          <Form.Group className="mb-3 text-center">
            <button
                className="button"
                type="submit"
                name="register"
            >
              Войти
            </button>
          </Form.Group>

          <Form.Group className="text-center">
            <span>Нет учётной записи? <a class="link" href="/register/">Зарегистрируйтесь!</a></span>
          </Form.Group>
        </Form>
      </div>
  );
}
