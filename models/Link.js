const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now() },
  click: { type: Number, default: 0 },
  owner: { type: Types.ObjectId, ref: "User" }
});

module.exports = model("Link", schema);

//Types.ObjectId - Здесь это связка модели пользователя и определённых записей в базе данных
//ref: "Link" - привязка к коллекции Link
