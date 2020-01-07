const { check, validationResult } = require("express-validator");
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const handle = require("../utils/promiseHandler");
const upload = require("../utils/multer");
const auth = require("../middleware/auth.middleware");

const router = Router();

// параметры 1 - метод запроса, 2 - массив валидаторов (middleware), 3 - логика ответа
// findOne - найти только одного

router.post(
  "/register",
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Минимальная длина пароля 6 символов").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    try {
      upload(req, res, async error => {
        if (error) {
          res.status(500).json({
            err: "Файл не был загружен в связи с ошибкой: " + error
          });
        } else {
          console.log(req.body, "BODY");
          console.log(req.body.email, req.body.password, "BODY2");
          const errors = validationResult(req.body);

          if (!errors.isEmpty()) {
            return res.status(400).json({
              errors: errors.array(),
              message: "Некорректные данные при регистрации"
            });
          }
          const { email, password } = req.body;
          const canidate = await User.findOne({ email });
          if (canidate) {
            return res
              .status(400)
              .json({ message: "Такой пользователь уже существует" });
          }
          const hashedPassword = await bcrypt.hash(password, 12); //12 - размер соли

          const user = new User({
            email,
            password: hashedPassword,
            cover: `${config.get("baseUrl")}/uploads/${req.file.filename}`,
            covername: req.file.filename
          });
          await user.save();
          res.status(201).json({ message: "Пользователь создан" }); //201 - создано
        }
      });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Что-то пошло не так. Попробуйте снова" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Введите корректный email")
      .normalizeEmail()
      .isEmail(),
    check("password", "Введите пароль").exists() //пароль должен существовать
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при регистрации"
        });
      }
      const { email, password } = req.body;

      //проверка email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }

      //сравнение паролей
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Неверный пароль, попробуйте снова" });
      }

      //генерирование токена
      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "4h"
      });
      res.json({ token, userId: user.id });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Что-то пошло не так. Попробуйте снова" });
    }
  }
);

router.get("/getme", auth, async (req, res) => {
  let [user, userError] = await handle(User.findOne({ _id: req.user.userId }));

  if (userError) {
    res.status(500).json({
      data: userError
    });
  } else {
    res.status(200).json({
      data: user
    });
  }
});

module.exports = router;

// Соль нужна для того, чтобы усложнить взлом по словарю (брутфорс)
// bcrypt.hash(password, 12), где 12 - это соль. Пример:
// password1 = '12345';
// salt = 'sflpr9fhi2'
// password1_saltedHash = md5($password1 . $salt) // = "12345sflpr9fhi2". Потом всё это хешируется
