import {Router} from "express";
import {PhotoModel} from "../models.js";
import mongoose from "mongoose";


const UPLOAD_DIR = "C:\\Users\\Park Sergey\\Documents\\mirea\\Projects\\dream-gallery\\upload";
const photoRouter = Router();

/**
 * POST /api/v1/photos/
 * Добавление фотографии в базу данных
 */
photoRouter.post("/", async (request, response) => {
  console.log(`POST /api/v1/photos/`);
  console.log(request.body);

  let {
    title,
    description,
    creatorId,
    categoryId,
    filename
  } = request.body;

  /*========= ВАЛИДАЦИЯ ДАННЫХ ==========*/
  let errors = [];

  if (!title || title.length === 0) {
    errors.push("Поле \"Название\" обязательное!");
  }

  if (!description) {
    description = "";
  }

  if (!creatorId || creatorId.length === 0) {
    errors.push("Не указан автор фотографии!");
  }

  if (!categoryId || categoryId.length === 0) {
    errors.push("Не задана категория фотографии!");
  }

  if (!filename || filename.length === 0) {
    errors.push("Не выбран файл для фотографии!");
  }

  if (errors.length !== 0) {
    response.status(400);

    response.json({
      errors: errors,
    });

    return;
  }

  /*========== ДОБАВЛЕНИЕ ФОТОГРАФИИ В БАЗУ ДАННЫХ ==========*/
  const photo = new PhotoModel({
    title: title,
    description: description,
    creatorId: mongoose.Types.ObjectId.createFromHexString(creatorId),
    categoryId: mongoose.Types.ObjectId.createFromHexString(categoryId),
    filename: filename,
    path: `${UPLOAD_DIR}\\${filename}`,
    published: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  PhotoModel
      .create(photo)
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
 * GET /api/v1/photos/
 * Возвращает список фотографий
 */
photoRouter.get("/", (request, response) => {
  console.log(`GET /api/v1/photos/`);

  let filter = {};

  // получение фотографий, добавленных указанным пользователем
  if (request.query.creatorId) {
    filter.creatorId = mongoose.Types.ObjectId.createFromHexString(request.query.creatorId);
  }

  // получение фотографий из указанной категории
  if (request.query.categoryId) {
    filter.categoryId = mongoose.Types.ObjectId.createFromHexString(request.query.categoryId);
  }

  PhotoModel
      .aggregate([
        {
          $match: filter,
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
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $project: {
            "_id": true,
            "title": true,
            "description": true,
            "filename": true,
            "path": true,
            "published": true,
            "createdAt": true,
            "updatedAt": true,
            "creator._id": true,
            "creator.username": true,
            "creator.email": true,
            "category._id": true,
            "category.title": true,
          }
        }
      ])
      .catch(error => {
        response.status(500);
        response.json({
          error: error.message,
        });
      })
      .then(result => {
        response.status(200);
        response.json(result);
      });
});

/**
 * GET /api/v1/photos/:id
 * Возвращает данные фотографии с указанным идентификатором
 */
photoRouter.get("/:id", (request, response) => {
  const photoId = request.params.id;
  console.log(`GET /api/v1/photos/${photoId}`);

  PhotoModel
      .aggregate([
        {
          $match: {_id: mongoose.Types.ObjectId.createFromHexString(photoId)},
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
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          }
        },
        {
          $project: {
            "_id": true,
            "title": true,
            "description": true,
            "filename": true,
            "path": true,
            "published": true,
            "createdAt": true,
            "updatedAt": true,
            "creator._id": true,
            "creator.username": true,
            "creator.email": true,
            "category._id": true,
            "category.title": true,
          }
        },
      ])
      .catch(error => {
        response.status(500);
        response.json({
          error: error.message,
        });
      })
      .then(result => {
        if (result.length === 0) {
          response.status(404);

          response.json({
            error: `Фотография с id = ${photoId} не найдена!`,
          });

          return;
        }

        response.status(200);
        response.json(result[0]);
      });
});

/**
 * PUT /api/v1/photos/:id
 * Обновляет данные фотографии с указанным идентификатором
 */
photoRouter.put("/:id", async (request, response) => {
  const photoId = request.params.id;

  if (!photoId) {
    response.status(400);

    response.json({
      error: "Не указан идентификатор фотографии!",
    });

    return;
  }

  console.log(`PUT /api/v1/photos/${photoId}`);
  console.log(request.body);

  request.body.updatedAt = new Date();

  PhotoModel
      .findByIdAndUpdate(photoId, request.body)
      .catch(error => {
        response.status(500);
        response.json({
          error: error.message,
        });
      })
      .then(result => {
        response.status(200);
        response.json(result);
      });
});

/**
 * DELETE /api/v1/photos/:id
 * Удаляет фотографию из базы данных
 */
photoRouter.delete("/:id", (request, response) => {
  const photoId = request.params.id;

  if (!photoId) {
    response.status(400);

    response.json({
      error: "Не указан идентификатор фотографии!",
    });

    return;
  }

  console.log(`DELETE /api/v1/photos/${photoId}`);

  PhotoModel
      .deleteOne({_id: photoId})
      .catch(error => {
        response.status(500);
        response.json({
          error: error.message,
        });
      })
      .then(result => {
        if (result.deletedCount === 0) {
          response.status(404);

          response.json({
            error: `Пользователь с id = ${photoId} не найден!`,
          });

          return;
        }

        response.status(200);
        response.json(result);
      });
});

export default photoRouter;
