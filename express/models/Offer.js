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
    seller: { type: Schema.Types.ObjectId, ref: "User" },

    applications: [{ type: String, ref: "Application" }],
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
