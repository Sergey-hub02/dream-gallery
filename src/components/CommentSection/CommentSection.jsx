import React, {useEffect, useState} from "react";
import {Form, Spinner} from "react-bootstrap";
import axios from "axios";
import {Comment} from "../Comment/Comment";
import {getTime} from "../../utils/functions";


/**
 * Секция комментариев
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const CommentSection = props => {
  const [validated, setValidated] = useState(false);
  const [content, setContent] = useState("");

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [comments, setComments] = useState([]);

  /**
   * Получение комментариев к фотографии и данных пользователя
   */
  useEffect(() => {
    // данные фотографии
    if (!props.photoId || props.photoId.length === 0) {
      return;
    }

    axios.get(`http://localhost:4000/api/v1/comments/?photoId=${props.photoId}`)
        .then(response => {
          console.log(response.data);
          setComments(response.data);
        });
  }, [props.photoId, props.userId]);

  /**
   * Отправка данных на сервер для добавления комментария
   * @param event
   */
  const handleComment = event => {
    /*========= ВАЛИДАЦИЯ ДАННЫХ ==========*/
    event.preventDefault();

    const form = event.currentTarget;
    const validity = form.checkValidity();

    if (!validity) {
      event.stopPropagation();
    }

    setValidated(true);

    /*========== ОТПРАВКА ЗАПРОСА ==========*/
    if (!validity) {
      return;
    }

    setIsLoading(true);

    const requestBody = {
      creatorId: props.userId,
      photoId: props.photoId,
      content: content,
    };

    axios.post("http://localhost:4000/api/v1/comments/", requestBody)
        .catch(error => {
          setIsLoading(false);
          setErrors(error.response["errors"]);
        })
        .then(response => {
          setIsLoading(false);

          if (response) {
            setSuccess(true);
            setValidated(false);

            setContent("");
            setErrors([]);
          }
        });
  };

  return (
      <div className="CommentSection pt-4">
        <h3>Комментарии</h3>

        <div className="comments mb-4">
          {
            comments && comments.length !== 0
                ? (
                    comments.map((comment, index) => {
                      return (
                          <Comment
                              key={index}
                              creator={comment.creator[0]}
                              content={comment.content}
                              createdAt={getTime(comment.createdAt)}
                          />
                      );
                    })
                )
                : <span>Нет комментариев</span>
          }
        </div>

        <Form
            noValidate
            validated={validated}
            onSubmit={handleComment}
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
                : (success && errors.length === 0)
                    ? (
                        <div className="alert alert-success" role="alert">Вы оставили комментарий!</div>
                    )
                    : <div></div>
          }

          <fieldset disabled={!props.userId}>
            <Form.Control
                type="hidden"
                name="creatorId"
                value={props.userId}
            />

            <Form.Control
                type="hidden"
                name="photoId"
                value={props.photoId}
            />

            <Form.Group className="mb-3" controlId="content">
              <Form.Label>Ваш комментарий</Form.Label>

              <Form.Control
                  as="textarea"
                  name="content"
                  value={content}
                  onChange={event => setContent(event.target.value)}
                  placeholder="Введите комментарий"
                  required
              />

              <Form.Control.Feedback type="invalid">Пожалуйста, введите комментарий!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <button className="button" type="submit" name="comment">
                Оставить комментарий

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
          </fieldset>
        </Form>
      </div>
  );
}
