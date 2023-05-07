import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {MyHeader} from "../../components/Header/MyHeader";
import {MyFooter} from "../../components/Footer/MyFooter";
import axios from "axios";
import {Container, Image} from "react-bootstrap";
import {getTime} from "../../utils/functions";


/**
 * Данные фотографии
 * @returns {JSX.Element}
 * @constructor
 */
export const PhotoDetails = () => {
  const params = useParams();
  const [photo, setPhoto] = useState(null);

  /**
   * Получение данных фотографии
   */
  useEffect(() => {
    const photoId = params.photoId;

    if (!photoId || photoId.length === 0) {
      return;
    }

    axios.get(`http://localhost:4000/api/v1/photos/${photoId}`)
        .then(response => {
          setPhoto(response.data);
        });
  }, [params]);

  return (
      <div className="PhotoDetails">
        <MyHeader />

        <main className="main">
          <Container>
            <div className="publication">
              <header className="publication-header mb-4">
                <h3 className="publication-title">{photo ? photo.title : ""}</h3>
                <Image
                    src={photo ? `/upload/${photo.filename}` : ""}
                    className="publication-image mw-100"
                />

                <div className="publication-data mt-3">
                  <div className="mb-1">
                    Автор: {photo ? `${photo.creator[0].username} (${photo.creator[0].email})` : ""}
                  </div>

                  <div className="mb-1">
                    Категория: {photo ? photo.category[0].title : ""}
                  </div>

                  <div className="mb-1">
                    Дата публикации: {photo ? getTime(photo.createdAt) : ""}
                  </div>

                  <div className="mb-1">
                    Дата изменения: {photo ? getTime(photo.updatedAt) : ""}
                  </div>
                </div>
              </header>

              <div className="publication-content">
                <h3>Описание</h3>
                {photo ? photo.description : ""}
              </div>
            </div>
          </Container>
        </main>

        <MyFooter />
      </div>
  );
}
