import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";


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

  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}/`);
  });
}


main()
    .catch(console.error);
