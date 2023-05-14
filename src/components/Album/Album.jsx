import React from "react";
import {Col, Row} from "react-bootstrap";
import {PhotoCard} from "../PhotoCard/PhotoCard";
import {getTime} from "../../utils/functions";
import {AlbumPhotoCard} from "../AlbumPhotoCard/AlbumPhotoCard";


/**
 * Альбом и его фотографии
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const Album = props => {
  return (
      <section className="section pt-3">
        <h4>Альбом &quot;{props.title}&quot;(<a href={`/albums/edit/${props.id}`} className="link">Редактировать</a>)</h4>

        <Row>
          {
            props.photos.map((photo, index) => {
              return (
                  <Col key={index} lg={4}>
                    <AlbumPhotoCard
                        src={`/upload/${photo.filename}`}
                        id={photo._id}
                        title={photo.title}
                        creator={props.author}
                        createdAt={getTime(photo.createdAt)}
                        editable={true}
                    />
                  </Col>
              );
            })
          }
        </Row>
      </section>
  );
}
