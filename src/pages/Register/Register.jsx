import React, {useState} from "react";
import {Form, Image, Spinner} from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie/lib";

import logo from "../../images/dream-gallery-512.png";
import "./register.css";


/**
 * Страница регистрации
 * @returns {JSX.Element}
 * @constructor
 */
export const Register = () => {
  const [validated, setValidated] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Валидация формы и отправка данных для регистрации
   * @param event
   */
  const handleRegister = event => {
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
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email,
      password: password,
    };

    axios.post("http://localhost:4000/api/v1/users/", requestBody)
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
              response.data["_id"].toString(),
              {
                path: "/",
                httpOnly: false,
              }
          );

          setFirstname("");
          setLastname("");
          setUsername("");
          setEmail("");
          setPassword("");
          setErrors([]);
        });
  };

  return (
      <div className="centered-form-wrapper">
        <Form
            noValidate
            validated={validated}
            className="centered-form"
            onSubmit={handleRegister}
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
              : (success)
                    ? (
                        <div className="alert alert-success" role="alert">Регистрация прошла успешно!</div>
                    )
                    : <div></div>
          }

          <Form.Group className="mb-3" controlId="firstname">
            <Form.Label>Имя</Form.Label>
            <Form.Control
                type="text"
                name="firstname"
                placeholder="Ваше имя"
                value={firstname}
                onChange={event => setFirstname(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="lastname">
            <Form.Label>Фамилия</Form.Label>
            <Form.Control
                type="text"
                name="lastname"
                placeholder="Ваша фамилия"
                value={lastname}
                onChange={event => setLastname(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Логин</Form.Label>

            <Form.Control
                type="text"
                name="username"
                placeholder="Ваш логин"
                value={username}
                required
                onChange={event => setUsername(event.target.value)}
            />

            <Form.Control.Feedback type="invalid">Пожалуйста, введите ваш логин!</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>

            <Form.Control
                type="email"
                name="email"
                placeholder="Ваш email"
                value={email}
                required
                onChange={event => setEmail(event.target.value)}
            />

            <Form.Control.Feedback type="invalid">Пожалуйста, введите ваш email!</Form.Control.Feedback>
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

          <Form.Group className="text-center">
            <button
                className="button"
                type="submit"
                name="register"
            >
              Зарегистрироваться

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
        </Form>
      </div>
  );
}
