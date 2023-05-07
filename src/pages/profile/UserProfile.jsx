import React, {useEffect, useState} from "react";
import {MyHeader} from "../../components/Header/MyHeader";
import {Card, Col, Container, Form, Row, Image, Spinner} from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie/lib";
import {redirect} from "react-router-dom";
import {getTime} from "../../utils/functions";

import "./UserProfile.css";
import profilePicture from "./user_picture.png";
import {MyFooter} from "../../components/Footer/MyFooter";
import {PhotoCard} from "../../components/PhotoCard/PhotoCard";


/**
 * Личный кабинет пользователя
 * @returns {JSX.Element}
 * @constructor
 */
export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [validated, setValidated] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [photos, setPhotos] = useState([]);

  /**
   * Валидация и отправка данных для обновления
   * @param event
   */
  const handleUpdate = event => {
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

    let requestBody = {
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email,
    };

    if (password.length !== 0) {
      requestBody.password = password;
    }

    axios.put(`http://localhost:4000/api/v1/users/${user._id.toString()}`, requestBody)
        .catch(error => {
          setIsLoading(false);
          setErrors(error.response.data["errors"]);
        })
        .then(_ => {
          setIsLoading(false);
          setSuccess(true);
          setValidated(false);
          setErrors([]);
          window.location.reload();
        });
  }

  /**
   * Получение данных пользователя, до того, как компонент отрендерился
   */
  useEffect(() => {
    const cookies = new Cookies();
    const userId = cookies.get("User-ID");

    if (!userId) {
      window.location = "/login/";
      return;
    }

    axios.get(`http://localhost:4000/api/v1/users/${userId}`)
        .then(response => {
          setUser(response.data);
          setFirstname(response.data.firstname);
          setLastname(response.data.lastname);
          setUsername(response.data.username);
          setEmail(response.data.email);
        });

    axios.get(`http://localhost:4000/api/v1/photos/?creatorId=${userId}`)
        .then(response => {
          setPhotos(response.data);
        });
  }, []);

  return (
      <div className="UserProfile">
        <MyHeader />

        <main className="main">
          <Container>
            <Row>
              <Col xl={3} className="mb-xl-0 mb-3">
                <Card className="profile-card text-center">
                  <Card.Header className="py-4">
                    <Image
                        src={profilePicture}
                        width={150}
                    />
                  </Card.Header>

                  <Card.Body>
                    {user ? (
                        <>
                          <Card.Title>{user.firstname} {user.lastname}</Card.Title>
                          <Card.Title>{user.username} ({user.email})</Card.Title>

                          <div>Регистрация: {getTime(user.createdAt)}</div>
                          <div>Изменено: {getTime(user.updatedAt)}</div>
                        </>
                    ) : (
                        <Spinner
                            animation="border"
                            role="status"
                            size="lg"
                        >
                          <div className="visually-hidden">Загрузка...</div>
                        </Spinner>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col xl={9}>
                <Card className="profile-card">
                  <Card.Body>
                    <h4 className="mb-3 text-xl-start text-center">Данные пользователя</h4>

                    <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleUpdate}
                    >
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
                            value={firstname}
                            onChange={event => setFirstname(event.target.value)}
                            placeholder="Ваше имя"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="lastname">
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastname"
                            value={lastname}
                            onChange={event => setLastname(event.target.value)}
                            placeholder="Ваша фамилия"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Логин</Form.Label>

                        <Form.Control
                            type="text"
                            name="username"
                            value={username}
                            onChange={event => setUsername(event.target.value)}
                            placeholder="Ваш логин"
                            required
                        />

                        <Form.Control.Feedback type="invalid">Пожалуйста, введите ваш логин!</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>

                        <Form.Control
                            type="email"
                            name="email"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            placeholder="Ваш email"
                            required
                        />

                        <Form.Control.Feedback type="invalid">Пожалуйста, введите ваш email!</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Новый пароль</Form.Label>

                        <Form.Control
                            type="password"
                            name="password"
                            onChange={event => setPassword(event.target.value)}
                            value={password}
                            placeholder="Ваш новый пароль"
                        />
                      </Form.Group>

                      <Form.Group className="text-xl-start text-center">
                        <button
                            className="button"
                            type="submit"
                            name="user-update"
                        >
                          Сохранить

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
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <section className="section pt-5">
              <h4>Мои фотографии (<a className="link" href="/photos/upload/">Добавить</a>)</h4>

              <div className="photos">
                <Row>
                  {
                    photos && photos.length !== 0
                        ? (
                            photos.map((photo, index) => {
                              return (
                                  <Col key={index} lg={4}>
                                    <PhotoCard
                                        src={`/upload/${photo.filename}`}
                                        id={photo._id}
                                        title={photo.title}
                                        category={photo.category[0].title}
                                        creator={photo.creator[0]}
                                        createdAt={getTime(photo.createdAt)}
                                        editable={true}
                                    />
                                  </Col>
                              );
                            })
                        )
                        : (
                            <div>Вы, пока, не загрузили ни одной фотографии!</div>
                        )
                  }
                </Row>
              </div>
            </section>
          </Container>
        </main>

        <MyFooter />
      </div>
  );
}
