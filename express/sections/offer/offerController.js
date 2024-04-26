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
      const {
        currency,
        quantity,
        price,
        forPayment,
        delivery,
        minQuantity,
        typeOfPrice,
        interestPrice,
      } = req.body;
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
        minQuantity,
        price,
        typeOfPrice,
        interestPrice,
        forPayment,
        location: user.location,
        delivery,
        proposals: [],
      });
      await offer.save();
      return res.json({ message: "Офер успешно создан", offerId: offer.id });
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
      const response = await getCryptoPrice(req.query.crypto, req.query.fiat);
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
      const offer = await Offer.findOne({ id: req.params.offerId });
      if (!offer) {
        return res.status(400).json({ message: "Offer не найден", errors });
      }

      const proposals = offer.proposals.length
        ? await Proposal.find({
            $or: offer.proposals.map((id) => ({ id: id })),
          })
        : [];
      if (!offer.users.includes(req.user.id)) {
        await Offer.updateOne(
          { id: req.params.offerId },
          { $push: { users: req.user.id } }
        );
      }
      const users = offer.users.length
        ? await User.find({
            $or: [...offer.users, req.user.id].map((id) => ({ id: id })),
          })
        : [];
      const mainUser = await User.findOne({ _id: offer.mainUser });

      res.json({
        mainUser,
        proposals,
        currency: offer.currency,
        quantity: offer.quantity,
        minQuantity: offer.minQuantity,
        price: offer.price,
        forPayment: offer.forPayment,
        location: offer.location,
        users,
        id: offer.id,
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
        user: user.id,
        username: user.username,
        quantity,
        offerId,
        createdAt,
      });
      await proposal.save();

      await Offer.updateOne(
        { id: offerId },
        { $push: { proposals: proposal.id } }
      );
      return res.json({ message: "Заявка отправлена" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Proposal error", err: e });
    }
  }
}

module.exports = new offerController();
