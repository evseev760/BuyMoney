const { Schema, model } = require("mongoose");
const { type } = require("os");

const User = new Schema({
  telegramId: { type: Number, unique: true, required: true },
  phoneNumber: { type: String },
  username: { type: String },
  languageCode: { type: String },
  allowsWriteToPm: { type: Boolean },
  authDate: { type: Date },
  nickname: { type: String },
  isAnOffice: { type: Boolean, default: false },
  delivery: {
    isDelivered: { type: Boolean, default: false },
    distance: { type: Number },
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      // required: true,
    },
    coordinates: {
      type: [Number],
      // required: true,
    },
    Country: { type: String },
    City: { type: String },
  },
  chatId: { type: String },
  avatar: { type: String },
  isSuspicious: { type: Boolean, default: false },
  tradingDisabled: { type: Boolean, default: false },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  reviews: [
    {
      rating: { type: Number, required: true },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});
module.exports = model("User", User);
