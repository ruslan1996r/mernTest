const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  cover: { type: String, required: true },
  covername: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  owner: { type: Types.ObjectId, ref: "User" }
});

module.exports = model("Post", schema);

//Types.ObjectId - Здесь это связка модели пользователя и определённых записей в базе данных
//ref: "Post" - привязка к коллекции Post
