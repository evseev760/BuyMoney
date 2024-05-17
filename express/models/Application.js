const { Schema, model } = require("mongoose");

const Application = new Schema({
  quantity: { type: Number, required: true },
  user: { type: String, required: true, ref: "User" },
  seller: { type: String, required: true, ref: "User" },
  username: { type: String, required: true },
  offerId: { type: String, required: true, ref: "Offers" },
  createdAt: { type: Number, required: true },
  currency: { type: String, required: true },
  forPayment: { type: String, required: true },
  paymentMethod: { type: String },
  price: { type: Number, required: true },
  status: { type: String, required: true },
});
module.exports = model("Application", Application);
