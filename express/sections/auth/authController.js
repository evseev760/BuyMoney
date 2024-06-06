const mongoose = require("mongoose");
const User = require("../../models/User");
const Offer = require("../../models/Offer");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const { default: axios } = require("axios");
const { getAvatar, getGeolocationData } = require("../../utils/apiService");
const { generateNickname } = require("../../utils/generateNickname");
const { phoneNumberInstructions } = require("../../utils/telegramUtils");
const { formatUserResponse } = require("../../utils/formatUserData");
const telegramBot = require("../../telegramBot");
const isProduction = process.env.NODE_ENV === "production";
const BOT_TOKEN = config.get(isProduction ? "BOT_TOKEN_PROD" : "BOT_TOKEN");

const generateAccessToken = (id, name, isSuspicious) => {
  const payload = {
    id,
    name,
    isSuspicious,
  };
  return jwt.sign(payload, config.get("secretKey"), { expiresIn: "24h" });
};

const verifyTelegramWebAppData = async (telegramInitData) => {
  const encoded = decodeURIComponent(telegramInitData);

  const secret = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN);

  const arr = encoded.split("&");
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];
  arr.sort((a, b) => a.localeCompare(b));
  const dataCheckString = arr.join("\n");

  const _hash = crypto
    .createHmac("sha256", secret.digest())
    .update(dataCheckString)
    .digest("hex");

  return _hash === hash;
};

class authController {
  async login(req, res) {
    const errors = validationResult(req);
    try {
      const { userData } = req.body;

      const params = new URLSearchParams(userData);
      const initData = {};
      params.forEach((value, key) => {
        initData[key] = value;
      });

      if (!verifyTelegramWebAppData(initData)) {
        return res.status(400).json({ message: "Недействительные данные" });
      }

      const telegramId = JSON.parse(initData.user).id;
      let user = await User.findOne({ telegramId });

      if (!user) {
        const avatar = await getAvatar(telegramId);
        const userData = JSON.parse(initData.user);
        const newUser = new User({
          avatar,
          telegramId,
          nickname: generateNickname(),
          username: userData.username,
          languageCode: userData.language_code,
          allowsWriteToPm: userData.allows_write_to_pm,
          authDate: new Date(initData.auth_date * 1000),
        });
        user = await newUser.save();
      } else {
        const userData = JSON.parse(initData.user);
        if (userData.username && user.username !== userData.username) {
          user.username = userData.username;
          await user.save();
        }
      }
      const token = generateAccessToken(
        user.id,
        initData.username,
        user.isSuspicious
      );
      return res.json({
        token,
        user: formatUserResponse(user),
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Authentication error" });
    }
  }

  async auth(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id });
      const token = generateAccessToken(
        user.id,
        user.username,
        user.isSuspicious
      );
      if (!user.nickname) {
        user.nickname = generateNickname();
        await user.save();
      }
      return res.json({
        token,
        user: formatUserResponse(user),
      });
    } catch (e) {
      console.log(e);
      res.send({ message: "Server error" });
    }
  }
  async updateUserData(req, res) {
    try {
      const { isAnOffice, delivery } = req.body;

      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          isAnOffice,
          delivery,
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await Offer.updateMany(
        { seller: mongoose.Types.ObjectId(req.user.id) },
        {
          $set: {
            "delivery.isDelivered": delivery.isDelivered,
            "delivery.distance": delivery.distance,
          },
        }
      );

      return res.json(formatUserResponse(user));
    } catch (e) {
      console.log(e);
    }
  }
  async updateUserLocation(req, res) {
    try {
      const { latitude, longitude } = req.body;
      // Получение данных о геолокации
      const geolocationData = await getGeolocationData(latitude, longitude);

      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
            Country: geolocationData?.address.country,
            City:
              geolocationData?.address.city ||
              geolocationData?.address.town ||
              geolocationData?.address.village,
          },
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await Offer.updateMany(
        { seller: mongoose.Types.ObjectId(req.user.id) },
        {
          $set: {
            "location.type": "Point",
            "location.coordinates": [longitude, latitude],
            "location.Country": geolocationData?.address.country,
            "location.City":
              geolocationData?.address.city ||
              geolocationData?.address.town ||
              geolocationData?.address.village,
          },
        }
      );

      return res.json(formatUserResponse(user));
    } catch (error) {
      console.error(
        "Ошибка при обновлении местоположения пользователя:",
        error
      );
      return res
        .status(500)
        .json({ message: "Ошибка при обновлении местоположения пользователя" });
    }
  }

  async sendPhoneNumberInstructions(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await phoneNumberInstructions(telegramBot, user.telegramId);
      res.json({ massage: "success" });
    } catch (e) {
      console.log(e);
    }
  }
  async disableTrading(req, res) {
    try {
      const { isDisableTrading } = req.body;
      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: { disableTrading: isDisableTrading } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await Offer.updateMany(
        { seller: user._id },
        { $set: { disableTrading: isDisableTrading } }
      );

      return res.json(formatUserResponse(user));
    } catch (e) {
      console.log(e);
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new authController();
