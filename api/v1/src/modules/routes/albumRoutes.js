import {Router} from "express";
import {AlbumModel} from "../models.js";
import mongoose from "mongoose";


const albumRouter = Router();

/**
 * POST /api/v1/albums/
 * Создание альбома
 */
albumRouter.post("/", async (request, response) => {
  console.log("POST /api/v1/albums/");
  console.log(request.body);

  let {
    title,
    creatorId,
  } = request.body;

  let photos = request.body["photos[]"];

  /*========== ВАЛИДАЦИЯ ДАННЫХ ==========*/
  let errors = [];

  if (!title || title.length === 0) {
    errors.push("Не заполнено поле \"Название\"!");
  }

  if (!photos || photos.length === 0) {
    errors.push("Выберите фотографии для альбома!");
  }

  if (!creatorId || creatorId.length === 0) {
    errors.push("Не указан автор альбома!");
  }

  if (errors.length !== 0) {
    response.status(400);

    response.json({
      errors: errors,
    });

    return;
  }

  /*========== ДОБАВЛЕНИЕ АЛЬБОМА ==========*/
  const album = new AlbumModel({
    title: title,
    photos: photos,
    creatorId: creatorId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  AlbumModel
      .create(album)
      .catch(error => {
        response.status(500);
        response.json({
          errors: [error.message],
        });
      })
      .then(result => {
        response.status(201);
        response.json(result);
      });
});

/**
 * GET /api/v1/albums/
 * Возвращает все альбомы из базы данных
 */
albumRouter.get("/", (request, response) => {
  console.log("GET /api/v1/albums/");

  let filter = {};

  // получение альбомов указанного пользователя
  if (request.query.creatorId) {
    filter.creatorId = mongoose.Types.ObjectId.createFromHexString(request.query.creatorId);
  }

  AlbumModel
      .aggregate([
        {
          $match: filter
        },
        {
          $lookup: {
            from: "users",
            localField: "creatorId",
            foreignField: "_id",
            as: "creator",
          }
        },
      ])
      .catch(error => {
        response.status(500);
        response.json({
          errors: [error.message],
        });
      })
      .then(result => {
        response.status(200);
        response.json(result);
      });
});

/**
 * GET /api/v1/albums/:id
 * Возвращает данные указанного альбома
 */
albumRouter.get("/:id", (request, response) => {
  const albumId = request.params.id;
  console.log(`GET /api/v1/albums/${albumId}`);

  AlbumModel
      .aggregate([
        {
          $match: {_id: mongoose.Types.ObjectId.createFromHexString(albumId)}
        },
        {
          $lookup: {
            from: "users",
            localField: "creatorId",
            foreignField: "_id",
            as: "creator",
          }
        },
        {
          $lookup: {
            from: "photos",
            localField: "photos",
            foreignField: "_id",
            as: "p",
          }
        },
      ])
      .catch(error => {
        response.status(500);
        response.json({
          errors: [error.message],
        });
      })
      .then(result => {
        if (result.length === 0) {
          response.status(404);

          response.json({
            error: `Альбом с id = ${albumId} не найден!`,
          });

          return;
        }

        response.status(200);
        response.json(result[0]);
      });
});

/**
 * PUT /api/v1/albums/:id
 * Обновляет данные указанного альбома
 */
albumRouter.put("/:id", (request, response) => {
  const albumId = request.params.id;
  if (!albumId) {
    response.status(400);

    response.json({
      error: "Не указан идентификатор альбома!",
    });

    return;
  }

  console.log(`PUT /api/v1/categories/${albumId}`);
  console.log(request.body);

  request.body.updatedAt = new Date();

  AlbumModel
      .findByIdAndUpdate(albumId, request.body)
      .catch(error => {
        response.status(500);
        response.json({
          errors: [error.message],
        });
      })
      .then(result => {
        response.status(200);
        response.json(result);
      });
});

/**
 * DELETE /api/v1/albums/:id
 * Удаление данных альбома
 */
albumRouter.delete("/:id", (request, response) => {
  const albumId = request.params.id;
  if (!albumId) {
    response.status(400);

    response.json({
      error: "Не указан идентификатор альбома!",
    });

    return;
  }

  console.log(`DELETE /api/v1/categories/${albumId}`);

  AlbumModel
      .deleteOne({_id: albumId})
      .catch(error => {
        response.status(500);
        response.json({
          errors: [error.message],
        });
      })
      .then(result => {
        if (result.deletedCount === 0) {
          response.status(404);

          response.json({
            error: `Альбом с id = ${albumId} не найден!`,
          });

          return;
        }

        response.status(200);
        response.json(result);
      })
});

export default albumRouter;
