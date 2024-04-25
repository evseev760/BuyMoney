const { Schema, model } = require("mongoose");
const { type } = require("os");

const User = new Schema({
  telegramId: { type: Number, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  username: { type: String },
  languageCode: { type: String },
  allowsWriteToPm: { type: Boolean },
  authDate: { type: Date },
  location: { type: String },
  chatId: { type: String },
});
module.exports = model("User", User);
