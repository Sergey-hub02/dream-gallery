import React, {useState} from "react";
import {Form, Image, Spinner} from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie/lib";

import "./register.css";
import logo from "../../images/dream-gallery-512.png";


/**
 * Страница авторизации
 * @returns {JSX.Element}
 * @constructor
 */
export const Login = () => {
  const [validated, setValidated] = useState(false);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Валидация данных и отправка данных на сервер для авторизации
   * @param event
   */
  const handleLogin = event => {
    /*========== ВАЛИДАЦИЯ ДАННЫХ ==========*/
    event.preventDefault();

    const form = event.currentTarget;
    const validity = form.checkValidity();

    if (!validity) {
      event.stopPropagation();
    }

    setValidated(true);

    /*========== ОТПРАВКА ДАННЫХ НА СЕРВЕР ==========*/
    if (!validity) {
      return;
    }

    setIsLoading(true);

    const requestBody = {
      usernameOrEmail: usernameOrEmail,
      password: password,
    };

    axios.post("http://localhost:4000/api/v1/users/login/", requestBody)
        .catch(error => {
          setIsLoading(false);
          setErrors(error.response.data["errors"]);
        })
        .then(response => {
          setIsLoading(false);
          setSuccess(true);
          setValidated(false);

          const cookies = new Cookies();

          cookies.set(
              "User-ID",
              response.data["userId"],
              {
                path: "/",
                httpOnly: false,
              }
          );

          setUsernameOrEmail("");
          setPassword("");
          setErrors([]);
        });
  }

  return (
      <div className="centered-form-wrapper">
        <Form
            noValidate
            validated={validated}
            className="centered-form"
            onSubmit={handleLogin}
        >
          <div className="text-center">
            <a href="/">
              <Image
                  className="form-logo"
                  src={logo}
              />

              <h1>Dream Gallery</h1>
            </a>
          </div>

          {
            errors.length !== 0
                ? (
                    <div className="alert alert-danger" role="alert">
                      {errors.map((error, index) => {
                        return (
                            <div key={index}>{error}</div>
                        );
                      })}
                    </div>
                )
                : (success && errors.length === 0)
                    ? (
                        <div className="alert alert-success" role="alert">Авторизация прошла успешно!</div>
                    )
                    : <div></div>
          }

          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Логин или email</Form.Label>

            <Form.Control
                type="text"
                name="usernameOrEmail"
                placeholder="Ваш логин или email"
                value={usernameOrEmail}
                required
                onChange={event => setUsernameOrEmail(event.target.value)}
            />

            <Form.Control.Feedback type="invalid">Пожалуйста, введите ваш логин или email!</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Пароль</Form.Label>

            <Form.Control
                type="password"
                name="password"
                placeholder="Ваш пароль"
                value={password}
                required
                onChange={event => setPassword(event.target.value)}
            />

            <Form.Control.Feedback type="invalid">Пожалуйста, введите ваш пароль!</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 text-center">
            <button
                className="button"
                type="submit"
                name="login"
            >
              Войти

              {isLoading
                  ? (
                      <Spinner
                          animation="border"
                          role="status"
                          size="sm"
                          className="ms-2"
                      >
                        <div className="visually-hidden">Загрузка...</div>
                      </Spinner>
                  )
                  : <span></span>}
            </button>
          </Form.Group>

          <Form.Group className="text-center">
            <span>Нет учётной записи? <a className="link" href="/register/">Зарегистрируйтесь!</a></span>
          </Form.Group>
        </Form>
      </div>
  );
}
