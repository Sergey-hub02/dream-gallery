import {Router} from "express";
import {PhotoModel} from "../models.js";


const UPLOAD_DIR = "C:\\Users\\Park Sergey\\Documents\\mirea\\Projects\\dream-gallery\\upload";
const photoRouter = Router();

/**
 * POST /api/v1/photos/
 * Добавление фотографии в базу данных
 */
photoRouter.post("/", async (request, response) => {
  console.log(`POST /api/v1/photos/`);
  console.log(request.body);
  console.log(UPLOAD_DIR);

  let {
    title,
    description,
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
    categoryId: categoryId,
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
photoRouter.get("/", (_, response) => {
  console.log(`GET /api/v1/photos/`);

  PhotoModel
      .find({})
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
  console.log(`GET /api/v1/users/${photoId}`);

  PhotoModel
      .findById(photoId)
      .catch(error => {
        response.status(500);
        response.json({
          error: error.message,
        });
      })
      .then(result => {
        if (!result) {
          response.status(404);

          response.json({
            error: `Не удалось найти фотографию с id = ${photoId}`,
          });

          return;
        }

        response.status(200);
        response.json(result);
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

  console.log(`PUT /api/v1/users/${photoId}`);
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

  console.log(`DELETE /api/v1/users/${photoId}`);

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
