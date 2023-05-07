import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {MyHeader} from "../../components/Header/MyHeader";
import {MyFooter} from "../../components/Footer/MyFooter";
import {Container, Form, Image, Spinner} from "react-bootstrap";
import Cookies from "universal-cookie/lib";


/**
 * Страница редактирования данных публикации
 * @returns {JSX.Element}
 * @constructor
 */
export const PhotoEdit = () => {
  const params = useParams();
  const [validated, setValidated] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [, setFilename] = useState(null);

  const [photoId, setPhotoId] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState("");

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Получение данных фотографии
   */
  useEffect(() => {
    // получение данных автора
    const cookies = new Cookies();
    const userId = cookies.get("User-ID");

    if (!userId) {
      window.location = "/login/";
      return;
    }

    setCreatorId(userId);

    // получение данных фотографии
    const photoId = params.photoId;
    setPhotoId(photoId);

    axios.get(`http://localhost:4000/api/v1/photos/${photoId}`)
        .then(response => {
          setTitle(response.data.title);
          setDescription(response.data.description);
          setImage(`/upload/${response.data.filename}`);
          setCategoryId(response.data.category[0]._id);
        });

    // определение категорий
    axios.get("http://localhost:4000/api/v1/categories/")
        .then(response => {
          setCategories(response.data);
        });
  }, [params]);

  /**
   * Отправка данных на сервер для изменения данных
   * @param event
   */
  const handleEdit = event => {
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

    const data = new FormData(form);

    axios.put(`http://localhost:4000/api/v1/photos/${photoId}`, data)
        .catch(error => {
          setIsLoading(false);
          setErrors(error.response.data["errors"]);
        })
        .then(response => {
          setSuccess(true);

          if (response) {
            setIsLoading(false);
            setValidated(false);

            setTitle("");
            setDescription("");

            form.reset();
            setErrors([]);
          }
        });
  };

  return (
      <div className="PhotoEdit">
        <MyHeader />

        <main className="main">
          <Container>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleEdit}
                encType="multipart/form-data"
            >
              <Form.Group className="mb-3 text-md-start text-center">
                <h3>Редактирование фотографии</h3>
              </Form.Group>

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
                            <div className="alert alert-success" role="alert">Данные публикации успешно обновлены!</div>
                        )
                        : <div></div>
              }

              <Form.Control
                  type="hidden"
                  name="creatorId"
                  value={creatorId}
              />

              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Название</Form.Label>

                <Form.Control
                    type="text"
                    name="title"
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    placeholder="Название фотографии"
                    required
                />

                <Form.Control.Feedback type="invalid">Пожалуйста, введите название фотографии!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Описание</Form.Label>

                <Form.Control
                    as="textarea"
                    name="description"
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    placeholder="Описание фотографии"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="categoryId">
                <Form.Label>Категория</Form.Label>

                <select
                    className="form-select"
                    id="categoryId"
                    name="categoryId"
                    onChange={event => setCategoryId(event.target.value)}
                    value={categoryId}
                    required
                >
                  {categories ? (
                      categories.map((category, index) => {
                        return (
                            <option
                                key={index}
                                value={category._id}
                            >
                              {category.title}
                            </option>
                        );
                      })
                  ) : (<option></option>)}
                </select>

                <Form.Control.Feedback type="invalid">Пожалуйста, выберите категорию фотографии!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <div className="mb-1">Изображение</div>

                <Image
                    src={image ? image : ""}
                    rounded
                    width={500}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="filename">
                <Form.Label>Файл</Form.Label>

                <Form.Control
                    type="file"
                    name="filename"
                    onChange={event => setFilename(event.target.files[0])}
                />
              </Form.Group>

              <Form.Group className="text-md-start text-center">
                <button
                    className="button"
                    type="submit"
                    name="upload"
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
                {" "}
                <button
                    className="button-danger"
                    type="button"
                    name="delete"
                    onClick={() => {
                      if (!photoId || photoId.length === 0) {
                        return;
                      }

                      axios.delete(`http://localhost:4000/api/v1/photos/${photoId}`)
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
