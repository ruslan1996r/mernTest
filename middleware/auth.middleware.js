const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    //Получить нужный хедер. Сделать сплит и взять 1-ю часть (сам токен)
    //Раскодировать его с помощью jwt.verify, передав токен и секрет. Раскодированный токен отдай в ответе
    const token = req.headers.authorization.split(" ")[1]; //Bearer Token
    if (!token) {
      return res.status(401).res.json({ message: "Нет авторизации" }); //no authorization
    }
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).res.json({ message: "Нет авторизации" });
  }
};

//OPTIONS Этот метод позволяет клиенту определять опции и/или требования, связанные с ресурсом,
//или возможностями сервера, но не производя никаких действий над ресурсом и не инициируя его загрузку
