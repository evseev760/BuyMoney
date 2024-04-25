const { Schema, model } = require("mongoose");

const Proposal = new Schema({
  quantity: { type: Number },
  user: { type: String, required: true, ref: "User" },
  username: { type: String, required: true },
  offerId: { type: String, required: true, ref: "Offers" },
  createdAt: { type: Number, required: true },
});
module.exports = model("Proposal", Proposal);
