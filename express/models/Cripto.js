const { Schema, model } = require("mongoose");

const PaymentMethodSchema = new Schema({
  label: { type: String },
  code: { type: String },
});

const Cripto = new Schema({
  cmcId: { type: Number },
  name: { type: String },
  slug: { type: String },
  symbol: { type: String },
  label: { type: String },
  code: { type: String },
  paymentMethodsList: [PaymentMethodSchema],
});

module.exports = model("Cripto", Cripto);
