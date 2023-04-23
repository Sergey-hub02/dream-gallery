import {Router} from "express";
import {CategoryModel} from "../models.js";


const categoryRouter = Router();

/**
 * POST /api/v1/categories/
 * Добавление категории в базу данных
 */
categoryRouter.post("/", async (request, response) => {
  console.log(`POST /api/v1/categories/`);
  console.log(request.body);

  let {title} = request.body;

  /*========= ВАЛИДАЦИЯ ДАННЫХ ==========*/
  let errors = [];

  if (!title || title.length === 0) {
    errors.push("Поле \"Название\" не заполнено!");
  }

  // проверка на уникальность категории
  const check = await CategoryModel
      .find({ title: title }, "_id title")

  if (check.length !== 0) {
    errors.push(`Категория \"${title}\" уже существует!`);
  }

  if (errors.length !== 0) {
    response.status(400);

    response.json({
      errors: errors,
    });

    return;
  }

  /*========== ДОБАВЛЕНИЕ КАТЕГОРИИ В БАЗУ ДАННЫХ ==========*/
  const category = new CategoryModel({
    title: title,
  });

  CategoryModel
      .create(category)
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
 * GET /api/v1/categories/
 * Возвращает список категорий
 */
categoryRouter.get("/", (_, response) => {
  console.log(`GET /api/v1/categories/`);

  CategoryModel
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
 * GET /api/v1/categories/:id
 * Возвращает данные категории с указанным идентификатором
 */
categoryRouter.get("/:id", (request, response) => {
  const categoryId = request.params.id;
  console.log(`GET /api/v1/categories/${categoryId}`);

  CategoryModel
      .findById(categoryId)
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
            error: `Не удалось найти категорию с id = ${categoryId}`,
          });

          return;
        }

        response.status(200);
        response.json(result);
      });
});

/**
 * PUT /api/v1/categories/:id
 * Обновляет данные категории с указанным идентификатором
 */
categoryRouter.put("/:id", async (request, response) => {
  const categoryId = request.params.id;

  if (!categoryId) {
    response.status(400);

    response.json({
      error: "Не указан идентификатор категории!",
    });

    return;
  }

  console.log(`PUT /api/v1/categories/${categoryId}`);
  console.log(request.body);

  CategoryModel
      .findByIdAndUpdate(categoryId, request.body)
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
 * DELETE /api/v1/categories/:id
 * Удаляет категорию из базы данных
 */
categoryRouter.delete("/:id", (request, response) => {
  const categoryId = request.params.id;

  if (!categoryId) {
    response.status(400);

    response.json({
      error: "Не указан идентификатор категории!",
    });

    return;
  }

  console.log(`DELETE /api/v1/users/${categoryId}`);

  CategoryModel
      .deleteOne({_id: categoryId})
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
            error: `Категория с id = ${categoryId} не найдена!`,
          });

          return;
        }

        response.status(200);
        response.json(result);
      });
});

export default categoryRouter;
