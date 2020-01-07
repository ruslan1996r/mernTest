const express = require("express");
const config = require("config");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json({ extended: true })); //bodyParser.json(), только встроенный. Юзай его
app.use(cors());
//Папка для сохранения файлов (картинки)
app.use("/uploads", express.static(path.resolve("uploads")));

//Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));
app.use("/api/post", require("./routes/post.routes"));
app.use("/t", require("./routes/redirect.routes"));

//Middleware для запуска клиентской части (билда) через Node.js
//"*" - любой запрос будет перенаправлен в index.html в папке client, build
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.senFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const PORT = config.get("port") || 5000;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    app.listen(PORT, () => console.log("app started on: " + PORT + "!!!"));
  } catch (error) {
    console.log("Server error", error.message);
    process.exit(1); //выйти из процесса Node.js в случае ошибки
  }
}

start();
