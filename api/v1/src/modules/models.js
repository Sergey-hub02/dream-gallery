import {model} from "mongoose";
import {Schema} from "mongoose";


/**
 * Роли пользователя в системе
 * @field {String} title              название роли
 * @field {String} description        описание роли
 */
const Role = new Schema({
  title: String,
  description: String,
});

/**
 * Пользователь ресурса
 * @field {String} firstname            имя пользователя
 * @field {String} lastname             фамилия
 * @field {String} username             имя пользователя в системе
 * @field {String} email                адрес электронной почты
 * @field {String} password             пароль (хранится в зашифрованном виде)
 * @field {Number} roleId               идентификатор роли пользователя
 * @field {Date} createdAt              дата регистрации
 * @field {Date} updatedAt              дата внесения последних изменений
 */
const User = new Schema({
  firstname: String,
  lastname: String,
  username: String,
  email: String,
  password: String,
  roleId: Number,
  createdAt: Date,
  updatedAt: Date,
});

/**
 * Фотография
 * @field {String} title              название фотографии
 * @field {String} description        описание фотографии
 * @field {String} filename           название файла с расширением
 * @field {String} path               путь к фотографии
 * @field {Boolean} published         факт публикации фотографии
 * @field {Date} createdAt            дата публикации фотографии
 * @field {Date} updatedAt            дата изменения данных фотографии
 */
const Photo = new Schema({
  title: String,
  description: String,
  filename: String,
  path: String,
  published: Boolean,
  createdAt: Date,
  updatedAt: Date,
});

/**
 * Категории фотографий
 * @field {String} title              название категории
 */
const Category = new Schema({
  title: String,
});

/**
 * Комментарий к фотографии
 * @field {String} creator              идентификатор автора комментария
 * @field {String} photo                идентификатор фотографии
 * @field {String} content              содержание комментария
 * @field {Date} createdAt              дата и время создания комментария
 */
const Comment = new Schema({
  creator: String,
  photo: String,
  content: String,
  createdAt: Date,
});

export const RoleModel = model("Role", Role);
export const UserModel = model("User", User);
export const PhotoModel = model("Photo", Photo);
export const CategoryModel = model("Category", Category);
export const CommentModel = model("Comment", Comment);
