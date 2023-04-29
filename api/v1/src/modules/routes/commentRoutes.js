import {Router} from "express";
import {CommentModel} from "../models.js";

const commentRouter = Router();

/**
 * POST /api/v1/comments/
 * Добавление комментария в базу данных
 */
commentRouter.post("/", async (request, response) => {
  console.log(`POST /api/v1/comments/`);
  console.log(request.body);

  let {
    creator,
    photo,
    content
  } = request.body;

  /*========= ВАЛИДАЦИЯ ДАННЫХ ==========*/
  let errors = [];

  if (!creator || creator.length === 0) {
    errors.push("Не указан автор комментария!");
  }

  if (!photo || photo.length === 0) {
    errors.push("Не указана комментируемая фотография!");
  }

  if (!content || content.length === 0) {
    errors.push("У комментария нет содержимого!");
  }

  if (errors.length !== 0) {
    response.status(400);

    response.json({
      errors: errors,
    });

    return;
  }

  /*========== ДОБАВЛЕНИЕ КОММЕНТАРИЯ В БАЗУ ДАННЫХ ==========*/
  const comment = new CommentModel({
    creator: creator,
    photo: photo,
    content: content,
    createdAt: new Date(),
  });

  CommentModel
      .create(comment)
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
 * GET /api/v1/comments/
 * Возвращает список комментариев
 */
commentRouter.get("/", (_, response) => {
  console.log(`GET /api/v1/comments/`);

  CommentModel
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
 * GET /api/v1/comments/:id
 * Возвращает данные комментария с указанным идентификатором
 */
commentRouter.get("/:id", (request, response) => {
  const commentId = request.params.id;
  console.log(`GET /api/v1/comments/${commentId}`);

  CommentModel
      .findById(commentId)
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
            error: `Не удалось найти комментарий с id = ${commentId}`,
          });

          return;
        }

        response.status(200);
        response.json(result);
      });
});

/**
 * PUT /api/v1/comments/:id
 * Обновляет данные комментария с указанным идентификатором
 */
commentRouter.put("/:id", async (request, response) => {
  const commentId = request.params.id;

  if (!commentId) {
    response.status(400);

    response.json({
      error: "Не указан идентификатор комментария!",
    });

    return;
  }

  console.log(`PUT /api/v1/comments/${commentId}`);
  console.log(request.body);

  request.body.updatedAt = new Date();

  CommentModel
      .findByIdAndUpdate(commentId, request.body)
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
 * DELETE /api/v1/comments/:id
 * Удаляет комментарий из базы данных
 */
commentRouter.delete("/:id", (request, response) => {
  const commentId = request.params.id;

  if (!commentId) {
    response.status(400);

    response.json({
      error: "Не указан идентификатор комментария!",
    });

    return;
  }

  console.log(`DELETE /api/v1/comments/${commentId}`);

  CommentModel
      .deleteOne({_id: commentId})
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
            error: `Комментарий с id = ${commentId} не найден!`,
          });

          return;
        }

        response.status(200);
        response.json(result);
      });
});

export default commentRouter;