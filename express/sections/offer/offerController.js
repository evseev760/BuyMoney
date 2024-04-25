const User = require("../../models/User");
const Offer = require("../../models/Offer");
const Proposal = require("../../models/Proposal");
const telegramBot = require("../../telegramBot");
const axios = require("axios");

const { validationResult } = require("express-validator");

async function getCryptoPrice(cryptoCurrency, currency) {
  try {
    // Формируем URL для запроса
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoCurrency}&vs_currencies=${currency}`;

    // Отправляем GET запрос к API CoinGecko
    const response = await axios.get(url);

    // Получаем цену криптовалюты из ответа
    const price = response.data;

    return price;
  } catch (error) {
    console.error("Ошибка при получении цены криптовалюты:", error);
    throw error; // Пробрасываем ошибку дальше, чтобы обработать ее на уровне вызывающего кода
  }
}

class offerController {
  async createOffer(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка при создании", errors });
      }
      console.log(2121212, req.body);
      const { currency, quantity, price, forPayment, location } = req.body;
      const candidate = await Offer.findOne({
        currency,
        mainUser: req.user.id,
      });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "У вас уже существует оффер с данной валютой" });
      }
      const user = await User.findOne({ _id: req.user.id });

      const offer = new Offer({
        mainUser: req.user.id,
        mainUsername: user.username,
        currency,
        quantity,
        price,
        forPayment,
        location,

        proposals: [],
      });
      await offer.save();
      return res.json({ message: "Офер успешно создан", offerId: offer._id });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Offer create error", err: e });
    }
  }
  async getOffers(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка запроса чатов", errors });
      }
      const offers = await Offer.find();
      res.json(offers);
    } catch (e) {
      console.log(e);
    }
  }
  async getPrice(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка запроса", errors });
      }
      console.log(66666, req.query.crypto, req.query.fiat);
      const response = await getCryptoPrice(req.query.crypto, req.query.fiat);
      console.log(777777, response);
      res.json(response);
    } catch (e) {
      console.log(e);
    }
  }
  async getOffer(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка запроса предложений", errors });
      }
      const offer = await Offer.findOne({ _id: req.params.offerId });
      if (!offer) {
        return res.status(400).json({ message: "Offer не найден", errors });
      }

      const proposals = offer.proposals.length
        ? await Proposal.find({
            $or: offer.proposals.map((id) => ({ _id: id })),
          })
        : [];
      if (!offer.users.includes(req.user.id)) {
        await Offer.updateOne(
          { _id: req.params.offerId },
          { $push: { users: req.user.id } }
        );
      }
      const users = offer.users.length
        ? await User.find({
            $or: [...offer.users, req.user.id].map((id) => ({ _id: id })),
          })
        : [];
      const mainUser = await User.findOne({ _id: offer.mainUser });

      res.json({
        mainUser,
        proposals,
        currency: offer.currency,
        quantity: offer.quantity,
        price: offer.price,
        forPayment: offer.forPayment,
        location: offer.location,
        users,
        _id: offer._id,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getProposals(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка запроса заявок", errors });
      }
      const proposals = await Proposal.find({ offer: req.params.offerId });

      res.json(proposals);
    } catch (e) {
      console.log(e);
    }
  }

  async addProposal(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при создании чата", errors });
      }
      const { offerId, quantity, createdAt } = req.body;

      const user = await User.findOne({ _id: req.user.id });
      const proposal = new Proposal({
        user: user._id,
        username: user.username,
        quantity,
        offerId,
        createdAt,
      });
      await proposal.save();

      await Offer.updateOne(
        { _id: offerId },
        { $push: { proposals: proposal._id } }
      );
      return res.json({ message: "Заявка отправлена" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Proposal error", err: e });
    }
  }
}

module.exports = new offerController();
