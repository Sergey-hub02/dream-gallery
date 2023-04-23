import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import userRouter from "./modules/routes/userRoutes.js";
import categoryRouter from "./modules/routes/categoryRoutes.js";
import photoRouter from "./modules/routes/photoRoutes.js";

const PORT = 4000;


/**
 * Запускает приложение
 * @returns {Promise<void>}
 */
const main = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/dream-gallery");
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/api/v1/users/", userRouter);
  app.use("/api/v1/categories/", categoryRouter);
  app.use("/api/v1/photos/", photoRouter);

  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}/`);
  });
}


main()
    .catch(console.error);
