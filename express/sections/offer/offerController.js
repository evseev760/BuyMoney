const User = require("../../models/User");
const Offer = require("../../models/Offer");
// const Proposal = require("../../models/Application");
const telegramBot = require("../../telegramBot");
const axios = require("axios");
const geolib = require("geolib");

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
        paymentMethods,
        comment,
      } = req.body;
      // const candidate = await Offer.findOne({
      //   currency,
      //   forPayment,
      //   mainUser: req.user.id,
      // });
      // if (candidate) {
      //   return res
      //     .status(400)
      //     .json({ message: "У вас уже существует оффер с данной валютой" });
      // }
      const user = await User.findOne({ _id: req.user.id });

      const offer = new Offer({
        mainUser: req.user.id,
        mainUsername: user.username,
        mainUserAvatar: user.avatar,
        currency,
        quantity,
        minQuantity,
        price,
        comment,
        typeOfPrice,
        interestPrice,
        paymentMethods,
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
      const user = await User.findOne({ _id: req.user.id });
      const filter = { ...req.query };
      // Если есть поле "sum", добавляем условие для фильтрации
      if ("sum" in filter) {
        const sum = parseInt(filter.sum);
        delete filter.sum; // Удаляем sum из фильтра
        filter.$and = [
          { quantity: { $gte: sum } },
          { minQuantity: { $lte: sum } },
        ];
      }

      if ("paymentMethods" in filter) {
        const paymentMethods = filter.paymentMethods.split(",");
        if (paymentMethods.length > 0) {
          filter.paymentMethods = { $elemMatch: { $in: paymentMethods } };
        }
      }

      // Удаляем пустые значения из фильтра
      Object.keys(filter).forEach((key) => {
        if (filter[key] === undefined || key === "distance") {
          delete filter[key];
        }
      });
      if (
        user &&
        user.location &&
        user.location.coordinates &&
        req.query.distance
      ) {
        const userCoordinates = user.location.coordinates;
        filter["location.coordinates"] = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [userCoordinates[0], userCoordinates[1]], // Порядок координат для MongoDB: [longitude, latitude]
            },
            $maxDistance: parseInt(req.query.distance), // Максимальное расстояние в метрах
          },
        };
      }
      let offers = await Offer.find(filter);

      // if (user && user.location && user.location.coordinates) {
      //   const userCoordinates = user.location.coordinates;
      //   offers = offers.map((offer) => {
      //     const offerCoordinates = offer.location.coordinates;
      //     const distance = geolib.getDistance(
      //       { latitude: userCoordinates[1], longitude: userCoordinates[0] },
      //       { latitude: offerCoordinates[1], longitude: offerCoordinates[0] }
      //     );
      //     return { ...offer, distance };
      //   });
      // }
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
      const offer = await Offer.findOne({ _id: req.params.offerId });
      if (!offer) {
        return res.status(400).json({ message: "Offer не найден", errors });
      }

      res.json(offer);
    } catch (e) {
      console.log(e);
    }
  }

  // async getProposals(req, res) {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(400)
  //         .json({ message: "Ошибка запроса заявок", errors });
  //     }
  //     const proposals = await Proposal.find({ offer: req.params.offerId });

  //     res.json(proposals);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // async addProposal(req, res) {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(400)
  //         .json({ message: "Ошибка при создании чата", errors });
  //     }
  //     const { offerId, quantity, createdAt } = req.body;

  //     const user = await User.findOne({ _id: req.user.id });
  //     const proposal = new Proposal({
  //       user: user.id,
  //       username: user.username,
  //       quantity,
  //       offerId,
  //       createdAt,
  //     });
  //     await proposal.save();

  //     await Offer.updateOne(
  //       { id: offerId },
  //       { $push: { proposals: proposal.id } }
  //     );
  //     return res.json({ message: "Заявка отправлена" });
  //   } catch (e) {
  //     console.log(e);
  //     res.status(400).json({ message: "Proposal error", err: e });
  //   }
  // }
}

module.exports = new offerController();
