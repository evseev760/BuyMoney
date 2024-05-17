const { Schema, model } = require("mongoose");

const PaymentMethodSchema = new Schema({
  label: { type: String },
  code: { type: String },
});

const Currency = new Schema({
  label: { type: String },
  code: { type: String },
  cmcId: { type: Number },
  name: { type: String },
  sign: { type: String },
  symbol: { type: String },
  paymentMethodsList: [PaymentMethodSchema],
});

module.exports = model("Currencies", Currency);
