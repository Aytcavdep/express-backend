//чтобы понимался Import, необходимо добавить в package.json "type": "module",
import express from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
//импорт для работы с mongodb
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
//коннект к базе mongodb
mongoose
  .connect(
    'mongodb+srv://Admin:7186@cluster0.v9pigjk.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err));

//апп это експресс сервер
const app = express();
//чтобы сервер понимал запросы json
app.use(express.json());

app.get('/', (req, res) => {
  res.send('1111 Hello world');
});

app.post('/auth/register', registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  res.json({
    succes: true,
  });
});
/*app.post('/auth/login', (req, res) => {
  //создание токена для авторизации
  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: 'Иванов Иван',
    },
    'password'
  );
  res.json({
    success: true,
    token,
  });
});*/
//запуск сервера на порте 4444 и обработка ошибки запуска сервера
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('server OK');
});
