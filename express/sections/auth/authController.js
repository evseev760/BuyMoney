const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

const BOT_TOKEN = config.get("BOT_TOKEN");

const generateAccessToken = (id, name) => {
  const payload = {
    id,
    name,
  };
  console.log(55555, payload);
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
  async handleAuth(req, res) {
    const errors = validationResult(req);
    try {
      const { username } = req.body;

      const params = new URLSearchParams(username);
      const initData = {};
      params.forEach((value, key) => {
        initData[key] = value;
      });

      if (!verifyTelegramWebAppData(initData)) {
        return res.status(400).json({ message: "Недействительные данные" });
      }

      // Проверяем, существует ли пользователь с указанным telegramId
      const telegramId = JSON.parse(initData.user).id;
      let user = await User.findOne({ telegramId });

      // Если пользователь не найден, создаем нового пользователя
      if (!user) {
        const userData = JSON.parse(initData.user);
        const newUser = new User({
          telegramId,
          firstName: userData.first_name,
          lastName: userData.last_name,
          username: userData.username,
          languageCode: userData.language_code,
          allowsWriteToPm: userData.allows_write_to_pm,
          authDate: new Date(initData.auth_date * 1000),
        });
        user = await newUser.save();
      }
      // Создаем токен доступа
      const token = generateAccessToken(user._id, initData.username);

      return res.json({
        token,
        user: {
          telegramId: user.telegramId,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          languageCode: user.languageCode,
          allowsWriteToPm: user.allowsWriteToPm,
          authDate: user.authDate,
          _id: user._id,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Authentication error" });
    }
  }

  async auth(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id });
      const token = generateAccessToken(user._id, user.username);
      return res.json({
        token,
        user: {
          telegramId: user.telegramId,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          languageCode: user.languageCode,
          allowsWriteToPm: user.allowsWriteToPm,
          authDate: user.authDate,
          _id: user._id,
        },
      });
    } catch (e) {
      console.log(e);
      res.send({ message: "Server error" });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find({}, { password: false });
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new authController();
