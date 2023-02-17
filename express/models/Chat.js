const { Schema, model } = require("mongoose");

const Chat = new Schema(
  {
    chatName: { type: String, unique: true, required: true },
    description: { type: String },
    mainUser: { type: String, ref: "User" },
    messages: [{ type: String, ref: "Message" }],
    users: [{ type: String, ref: "User" }],
  }
  // { typeKey: "$types" }
);
module.exports = model("Chats", Chat);
