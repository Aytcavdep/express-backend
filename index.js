import multer from "multer";
//чтобы понимался Import, необходимо добавить в package.json "type": "module",
import express from "express";
//импорт для работы с mongodb
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import { UserController, PostController } from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

//коннект к базе mongodb
mongoose
  .connect(
    "mongodb+srv://Admin:7189@cluster0.v9pigjk.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error", err));

//апп это експресс сервер
const app = express();
//чтобы сервер понимал запросы json
app.use(express.json());

//проверка на наличие статичных файло в директории
app.use("/uploads", express.static("uploads"));
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("1111 Hello world");
});

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.get("/auth/me", checkAuth, UserController.getMe);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

//запуск сервера на порте 4444 и обработка ошибки запуска сервера
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server OK");
});
