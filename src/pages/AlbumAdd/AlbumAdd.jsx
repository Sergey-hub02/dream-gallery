import React, {useEffect, useState} from "react";
import {MyHeader} from "../../components/Header/MyHeader";
import {MyFooter} from "../../components/Footer/MyFooter";
import {Container, Form, Image, Spinner} from "react-bootstrap";
import Cookies from "universal-cookie/lib";
import axios from "axios";

import "./AlbumAdd.css";


/**
 * Станица добавления альбома
 * @returns {JSX.Element}
 * @constructor
 */
export const AlbumAdd = () => {
  const [userId, setUserId] = useState("");
  const [photos, setPhotos] = useState([]);
  const [validated, setValidated] = useState(false);

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Получение идентификатора авторизованного пользователя
   */
  useEffect(() => {
    const cookies = new Cookies();
    const userId = cookies.get("User-ID");

    if (!userId || userId.length === 0) {
      window.location = "/login/";
      return;
    }

    setUserId(userId);

    axios.get(`http://localhost:4000/api/v1/photos/?creatorId=${userId}`)
        .then(response => {
          setPhotos(response.data);
        });
  }, []);

  /**
   * Отправка данных для создания альбома
   * @param event
   */
  const handleAlbumCreate = event => {
    /*========== ВАЛИДАЦИЯ ДАННЫХ ==========*/
    event.preventDefault();

    const form = event.currentTarget;
    const validity = form.checkValidity();

    if (!validity) {
      event.stopPropagation();
    }

    setValidated(true);

    /*========== ОТПРАВКА ДАННЫХ ==========*/
    if (!validity) {
      return;
    }

    setIsLoading(true);
    const data = new FormData(form);

    axios.post("http://localhost:4000/api/v1/albums/", data)
        .catch(error => {
          setIsLoading(false);
          setErrors(error.response.data["errors"]);
        })
        .then(response => {
          setSuccess(true);

          if (response) {
            setIsLoading(false);
            setValidated(false);

            form.reset();
            setErrors([]);
          }
        });
  };

  return (
      <div className="AlbumAdd">
        <MyHeader />

        <main className="main">
          <Container>
            <Form
                validated={validated}
                noValidate
                onSubmit={handleAlbumCreate}
            >
              <h3 className="text-sm-start text-center">Создание альбома</h3>

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
                            <div className="alert alert-success" role="alert">Альбом успешно создан!</div>
                        )
                        : <div></div>
              }

              <Form.Control
                  type="hidden"
                  name="creatorId"
                  value={userId}
              />

              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Название</Form.Label>

                <Form.Control
                    type="text"
                    name="title"
                    placeholder="Название альбома"
                    required
                />

                <Form.Control.Feedback type="invalid">Пожалуйста, введите название альбома!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="photos">
                <Form.Label>Фотографии</Form.Label>

                <div className="photos">
                  {
                    !photos || photos.length === 0
                        ? (
                            <div>У вас нет фотографий!</div>
                        )
                        : (
                            photos.map((photo, index) => {
                              return (
                                  <div key={index} className="photo mb-3 d-flex align-items-center">
                                    <label className="form-label" htmlFor={photo._id}>
                                      <Image
                                          className="photo-image"
                                          src={`data:${photo.fileType};base64,${photo.file}`}
                                      />
                                    </label>

                                    <Form.Check
                                        id={photo._id}
                                        className="ps-2"
                                        type="checkbox"
                                        name="photos[]"
                                        value={photo._id}
                                    />
                                  </div>
                              )
                            })
                        )
                  }
                </div>
              </Form.Group>

              <Form.Group className="text-sm-start text-center">
                <button
                    className="button"
                    type="submit"
                    name="create-album"
                >
                  Создать

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
          </Container>
        </main>

        <MyFooter />
      </div>
  );
}
