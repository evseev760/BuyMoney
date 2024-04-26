const { Schema, model } = require("mongoose");

const Offer = new Schema(
  {
    currency: { type: String },
    quantity: { type: Number },
    minQuantity: { type: Number },
    price: { type: Number },
    forPayment: { type: String },
    location: { type: String },
    mainUser: { type: String, ref: "User" },
    mainUsername: { type: String },
    proposals: [{ type: String, ref: "Proposal" }],
    users: [{ type: String, ref: "User" }],
    delivery: {
      isDelivered: { type: Boolean },
      price: { type: Number },
      distance: { type: Number },
    },
  }
  // { typeKey: "$types" }
);
module.exports = model("Offers", Offer);
