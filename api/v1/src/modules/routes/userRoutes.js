import {Router} from "express";
import {UserModel} from "../models.js";
import argon2 from "argon2";


const userRouter = Router();

/**
 * POST /api/v1/users/
 * Добавление пользователя в базу данных
 */
userRouter.post("/", async (request, response) => {
  console.log(`POST /api/v1/users/`);
  console.log(request.body);

  let {
      firstname,
      lastname,
      username,
      email,
      password,
      roleId
  } = request.body;

  /*========= ВАЛИДАЦИЯ ДАННЫХ ==========*/
  let errors = [];

  if (!firstname) {
    firstname = "";
  }

  if (!lastname) {
    lastname = "";
  }

  if (!username || username.length === 0) {
    errors.push("Поле \"Логин\" обязательное!");
  }

  if (!email || email.length === 0) {
    errors.push("Поле \"Email\" обязательное!");
  }

  if (!password || password.length === 0) {
    errors.push("Поле \"Пароль\" обязательное!");
  }

  if (!roleId) {
    roleId = 1;   // идентификатор роли "Зарегистрированный пользователь"
  }

  // проверка на уникальность имени пользователя в системе
  const check = await UserModel
      .find({ username: username }, "_id username");

  if (check.length !== 0) {
    errors.push(`Имя ${username} уже занято!`);
  }

  if (errors.length !== 0) {
    response.status(400);

    response.json({
      errors: errors,
    });

    return;
  }

  /*========== ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ В БАЗУ ДАННЫХ ==========*/
  const hashedPwd = await argon2.hash(password);

  const user = new UserModel({
    firstname: firstname,
    lastname: lastname,
    username: username,
    email: email,
    password: hashedPwd,
    roleId: roleId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  UserModel
      .create(user)
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
 * GET /api/v1/users/
 * Возвращает список пользователей
 */
userRouter.get("/", (_, response) => {
  console.log(`GET /users/`);

  UserModel
      .find({}, "_id firstname lastname username email roleId createdAt updatedAt")
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
 * GET /api/v1/users/:id
 * Возвращает данные пользователя с указанным идентификатором
 */
userRouter.get("/:id", (request, response) => {
  const userId = request.params.id;
  console.log(`GET /users/${userId}`);

  UserModel
      .findById(userId)
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
            error: `Не удалось найти пользователя с id = ${userId}`,
          });

          return;
        }

        response.status(200);
        response.json(result);
      });
});

/**
 * PUT /api/v1/users/:id
 * Обновляет данные пользователя с указанным идентификатором
 */
userRouter.put("/:id", async (request, response) => {
  const userId = request.params.id;

  if (!userId) {
    response.status(400);

    response.json({
      error: "Не указан идентификатор пользователя!",
    });

    return;
  }

  console.log(`PUT /api/v1/users/${userId}`);
  console.log(request.body);

  if (request.body.password) {
    request.body.password = await argon2.hash(request.body.password);
  }

  request.body.updatedAt = new Date();

  UserModel
      .findByIdAndUpdate(userId, request.body)
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
 * DELETE /api/v1/users/:id
 * Удаляет пользователя из базы данных
 */
userRouter.delete("/:id", (request, response) => {
  const userId = request.params.id;

  if (!userId) {
    response.status(400);

    response.json({
      error: "Не указан идентификатор пользователя!",
    });

    return;
  }

  console.log(`DELETE /api/v1/users/${userId}`);

  UserModel
      .deleteOne({_id: userId})
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
            error: `Пользователь с id = ${userId} не найден!`,
          });

          return;
        }

        response.status(200);
        response.json(result);
      });
});

export default userRouter;
