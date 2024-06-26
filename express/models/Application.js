const { Schema, model } = require("mongoose");

const Application = new Schema({
  quantity: { type: Number, required: true },
  user: { type: String, required: true, ref: "User" },
  seller: { type: String, required: true, ref: "User" },
  // username: { type: String, required: true },
  offerId: { type: String, required: true, ref: "Offers" },
  createdAt: { type: Number, required: true },
  currency: { type: String, required: true },
  forPayment: { type: String, required: true },
  paymentMethod: { type: String },
  price: { type: Number, required: true },
  updatedAt: { type: Number, default: Date.now },
  distance: { type: Number },
  messageId: {
    seller: { type: Number },
    buyer: { type: Number },
  },
  rating: {
    buyer: { type: Number },
    seller: { type: Number },
  },
  comment: {
    buyer: { type: String },
    seller: { type: String },
  },
  status: {
    type: String,
    required: true,
    enum: ["NEW", "PENDING", "CONFIRMATION", "COMPLETED", "FROZEN"],
  },
  isExcludedFromRating: { type: Boolean, default: false },
  сreatedChat: { type: Number },
});

Application.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = model("Application", Application);
