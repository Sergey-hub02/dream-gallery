import React from "react";
import {Card} from "react-bootstrap";

import "./PhotoCard.css";


/**
 * Карточка для фотографии
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const AlbumPhotoCard = props => {
  return (
      <Card className="photo-card mb-3">
        <a href={`/photos/${props.id}`}>
          <Card.Img
              variant="top"
              src={props.src}
          />
        </a>

        <Card.Header className="photo-card-header">
          <Card.Title className="text-center py-2 mb-0">
            <a className="photo-card-link" href={`/photos/${props.id}`}>
              {props.title}
            </a>
          </Card.Title>
        </Card.Header>

        <Card.Body>
          <div className="photo-card-info">
            <div className="mb-1">Автор: {props.creator.username} ({props.creator.email})</div>
            <div className="mb-1">Опубликовано: {props.createdAt}</div>
          </div>
        </Card.Body>

        <Card.Footer className="text-center py-4">
          <a href={`/photos/${props.id}`} className="button">Подробнее</a>
          {" "}
          {props.editable ? (
              <a href={`/photos/edit/${props.id}`} className="button">Редактировать</a>
          ) : ""}
        </Card.Footer>
      </Card>
  );
}
