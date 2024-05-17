const { Schema, model } = require("mongoose");

const Offer = new Schema(
  {
    currency: { type: String },
    quantity: { type: Number },
    minQuantity: { type: Number },
    price: { type: Number },
    interestPrice: { type: Number },
    forPayment: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      Country: { type: String },
      City: { type: String },
    },
    mainUser: { type: String, ref: "User" },
    mainUsername: { type: String },
    mainUserAvatar: { type: String },
    proposals: [{ type: String, ref: "Proposal" }],
    users: [{ type: String, ref: "User" }],
    paymentMethods: [{ type: String }],
    comment: { type: String },
    createdAt: { type: Number },
    delivery: {
      isDelivered: { type: Boolean },
      price: { type: Number },
      distance: { type: Number },
    },
  }
  // { typeKey: "$types" }
);
Offer.index({ "location.coordinates": "2dsphere" });
module.exports = model("Offers", Offer);
