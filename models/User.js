const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cover: { type: String },
  covername: { type: String },
  links: [{ type: Types.ObjectId, ref: "Link" }],
  posts: [{ type: Types.ObjectId, ref: "Post" }]
});

module.exports = model("User", schema);

//Types.ObjectId - Здесь это связка модели пользователя и определённых записей в базе данных
//ref: "Link" - привязка к коллекции Link
