const axios = require("axios");
const Application = require("../../models/Application");
const User = require("../../models/User");
const Currency = require("../../models/Currency");
const Cripto = require("../../models/Cripto");
const config = require("config");
const telegramBot = require("../../telegramBot");

const { validationResult } = require("express-validator");
const ApplicationStatus = {
  NEW: "NEW",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
};

class applicationApiController {
  async createApplication(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка запроса", errors });
      }
      const {
        quantity,
        currency,
        forPayment,
        paymentMethod,
        offerId,
        price,
        seller,
      } = req.body;
      const { id, name } = req.user;
      // console.log(444, req.user);
      const buyerUser = await User.findOne({ _id: id });
      const newApplication = {
        quantity,
        user: id,
        username: buyerUser.username,
        offerId,
        createdAt: Date.now(),
        currency,
        forPayment,
        paymentMethod,
        price,
        seller,
        status: ApplicationStatus.NEW,
      };

      const application = new Application(newApplication);
      await application.save();
      const sellerUser = await User.findOne({ _id: seller });
      const currencyItem = await Currency.findOne({ code: currency });
      let forPaymentItem = await Cripto.findOne({ code: forPayment });
      if (!forPaymentItem) {
        forPaymentItem = await Currency.findOne({ code: forPayment });
      }
      const paymentMethodItem = forPaymentItem?.paymentMethodsList?.find(
        (item) => item.code === paymentMethod
      )?.label;

      const message =
        `
          У вас новая заявка!
          🏷️ Цена: ${price}
          💰 Сумма: ${quantity}
          💱 Валюта: ${currencyItem.label}
          💸 К оплате: ${forPaymentItem.label}` +
        (paymentMethodItem ? `💳 Способ оплаты: ${paymentMethodItem}` : "") +
        `👤 Покупатель: ${buyerUser.username}
        `;
      const callbackData = {
        offerId,
        applicationId: application._id,
      };
      telegramBot.sendMessage(sellerUser.telegramId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "👍 Принять заявку",
                callback_data: `${application._id}`,
              },
            ],
          ],
        },
      });
      res.json(newApplication);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }
  async getMyApplications(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка запроса", errors });
      }

      const { id } = req.user;

      const user = await User.findOne({ _id: id });
      if (!user) {
        return res.status(400).json({ message: "Юзер не найден", errors });
      }
      const applications = await Application.find({
        $or: [{ user: id }, { seller: id }],
      });

      res.json(applications);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }
}

module.exports = new applicationApiController();
