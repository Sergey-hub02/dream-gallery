import React, {useEffect, useState} from "react";
import {MyHeader} from "../components/Header/MyHeader";
import {MyFooter} from "../components/Footer/MyFooter";
import {Col, Container, Row} from "react-bootstrap";
import axios from "axios";

import "./Home.css";
import {PhotoCard} from "../components/PhotoCard/PhotoCard";
import {getTime} from "../utils/functions";


/**
 * Главная страница сайта
 * @returns {JSX.Element}
 * @constructor
 */
export const Home = () => {
  const [sections, setSections] = useState({});

  /**
   * Получение фотографий и распределение их по категориям
   */
  useEffect(() => {
    axios.get("http://localhost:4000/api/v1/photos/")
        .then(response => {
          const sectionPhotos = {};

          response.data.forEach(photo => {
            const categoryId = photo.category[0]._id;

            if (!sectionPhotos[categoryId]) {
              sectionPhotos[categoryId] = {
                name: photo.category[0].title,
                photos: [],
              };
            }

            sectionPhotos[categoryId].photos.push(photo);
          });

          setSections(sectionPhotos);
        });
  }, [])

  return (
      <div className="Home">
        <MyHeader />

        <main className="main">
          {
            sections
                ? Object.keys(sections).map((sectionId, index) => {
                  return (
                      <section key={index} className="section">
                        <Container>
                          <header className="section-header">
                            <h5>Категория &quot;{sections[sectionId].name}&quot;</h5>
                          </header>

                          <div className="section-content">
                            <Row>
                              {
                                sections[sectionId].photos.map((photo, index) => {
                                  return (
                                      <Col lg={4} key={index}>
                                        <PhotoCard
                                            src={`data:${photo.fileType};base64,${photo.file}`}
                                            id={photo._id}
                                            title={photo.title}
                                            category={photo.category[0].title}
                                            creator={photo.creator[0]}
                                            createdAt={getTime(photo.createdAt)}
                                        />
                                      </Col>
                                  );
                                })
                              }
                            </Row>
                          </div>
                        </Container>
                      </section>
                  )
                })
                : <div></div>
          }
        </main>

        <MyFooter />
      </div>
  );
}
