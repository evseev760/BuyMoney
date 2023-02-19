const { Schema, model } = require("mongoose");

const Message = new Schema({
  textMessage: { type: String },
  user: { type: String, required: true, ref: "User" },
  username: { type: String, required: true },
  chat: { type: String, required: true, ref: "Chats" },
  createdAt: { type: Number, required: true },
});
module.exports = model("Message", Message);
