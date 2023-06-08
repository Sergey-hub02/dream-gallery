import React, {useEffect, useState} from "react";
import {MyHeader} from "../../components/Header/MyHeader";
import {MyFooter} from "../../components/Footer/MyFooter";
import {Container, Form, Spinner} from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie/lib";

import "./PhotoUpload.css";
import "draft-js/dist/Draft.css";


/**
 * Страница загрузки фотографий
 * @returns {JSX.Element}
 * @constructor
 */
export const PhotoUpload = () => {
  const [validated, setValidated] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [, setFilename] = useState(null);

  const [creatorId, setCreatorId] = useState("");
  const [, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // определение авторизованного пользователя
    const cookies = new Cookies();
    const userId = cookies.get("User-ID");

    if (!userId) {
      window.location = "/login/";
      return;
    }

    setCreatorId(userId);

    // определение категорий
    axios.get("http://localhost:4000/api/v1/categories/")
        .then(response => {
          setCategories(response.data);
        });
  }, []);

  /**
   * Отправка данных на сервер для загрузки файла
   * @param event
   */
  const handleUpload = event => {
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

    axios.post(`http://localhost:4000/api/v1/photos/`, data)
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
  }

  return (
      <div className="PhotoUpload">
        <MyHeader />

        <div className="upload-section">
          <Container>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleUpload}
                encType="multipart/form-data"
            >
              <Form.Group className="mb-3 text-md-start text-center">
                <h3>Загрузка фотографии</h3>
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
                            <div className="alert alert-success" role="alert">Фотография успешно загружена!</div>
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
                    required
                >
                  {categories ? (
                      categories.map((category, index) => {
                        return <option key={index} value={category._id}>{category.title}</option>;
                      })
                  ) : (<option></option>)}
                </select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="filename">
                <Form.Label>Файл</Form.Label>

                <Form.Control
                    type="file"
                    onChange={event => setFilename(event.target.files[0])}
                    name="filename"
                    required
                />

                <Form.Control.Feedback type="invalid">Пожалуйста, выберите файл!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="text-md-start text-center">
                <button
                    className="button"
                    type="submit"
                    name="upload"
                >
                  Загрузить

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
        </div>

        <MyFooter />
      </div>
  );
}
