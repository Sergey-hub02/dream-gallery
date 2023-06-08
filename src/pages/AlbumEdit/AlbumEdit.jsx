import React, {useEffect, useState} from "react";
import {MyHeader} from "../../components/Header/MyHeader";
import {MyFooter} from "../../components/Footer/MyFooter";
import {Container, Form, Image, Spinner} from "react-bootstrap";
import {useParams} from "react-router-dom";
import Cookies from "universal-cookie/lib";
import axios from "axios";

import "./AlbumEdit.css";


/**
 * Страница редактирования альбома
 * @returns {JSX.Element}
 * @constructor
 */
export const AlbumEdit = () => {
  const params = useParams();

  const [userId, setUserId] = useState("");
  const [photos, setPhotos] = useState([]);
  const [validated, setValidated] = useState(false);

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [album, setAlbum] = useState(null);

  /**
   * Получение идентификатора авторизованного пользователя
   */
  useEffect(() => {
    const cookies = new Cookies();
    const userId = cookies.get("User-ID");
    const albumId = params.albumId;

    if (!userId || userId.length === 0) {
      window.location = "/login/";
      return;
    }

    setUserId(userId);

    axios.get(`http://localhost:4000/api/v1/photos/?creatorId=${userId}`)
        .then(response => {
          setPhotos(response.data);
        });

    axios.get(`http://localhost:4000/api/v1/albums/${albumId}`)
        .then(response => {
          setAlbum(response.data);
        });
  }, [params]);

  /**
   * Отправка данных для обновления альбома
   * @param event
   */
  const handleAlbumUpdate = event => {
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

    axios.put(`http://localhost:4000/api/v1/albums/${params.albumId}`, data)
        .catch(error => {
          setIsLoading(false);
          setErrors(error.response.data["errors"]);
        })
        .then(response => {
          setSuccess(true);

          if (response) {
            setIsLoading(false);
            setValidated(false);

            window.location.reload();
            setErrors([]);
          }
        });
  }

  return (
      <div className="AlbumEdit">
        <MyHeader />

        <main className="main">
          <Container>
            <Form
                validated={validated}
                noValidate
                onSubmit={handleAlbumUpdate}
            >
              <h3 className="text-sm-start text-center">Изменение альбома &quot;{album ? album.title : ""}&quot;</h3>

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
                            <div className="alert alert-success" role="alert">Альбом успешно изменён!</div>
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
                    defaultValue={album ? album.title : ""}
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
                  Изменить

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
                {" "}
                <button
                    className="button-danger"
                    type="button"
                    name="delete"
                    onClick={() => {
                      if (!params.albumId || params.albumId.length === 0) {
                        return;
                      }

                      axios.delete(`http://localhost:4000/api/v1/albums/${params.albumId}`)
                          .then(response => {
                            if (response) {
                              window.location = "/profile/";
                            }
                          });
                    }}
                >
                  Удалить
                </button>
              </Form.Group>
            </Form>
          </Container>
        </main>

        <MyFooter />
      </div>
  );
}
