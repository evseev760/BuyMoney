const mongoose = require("mongoose");
const User = require("../../models/User");
const Offer = require("../../models/Offer");
const Cripto = require("../../models/Cripto");
const { getCryptoPrice } = require("../../utils/apiService");
const Application = require("../../models/Application");
const telegramBot = require("../../telegramBot");

const { validationResult } = require("express-validator");

const calculateOfferPrices = async (offers) => {
  const cryptoPairs = offers
    ?.filter((offer) => offer.interestPrice)
    .map((offer) => ({
      forPayment: offer.forPayment,
      currency: offer.currency,
    }));

  // Получение уникальных криптовалют
  const uniquePairs = [
    ...new Set(
      cryptoPairs.map((pair) => `${pair.forPayment}-${pair.currency}`)
    ),
  ];
  const forPayments = uniquePairs.map((pair) => pair.split("-")[0]);
  const cryptoItems = await Cripto.find({ code: { $in: forPayments } });

  const cryptoData = uniquePairs.map((pair) => {
    const [forPayment, currency] = pair.split("-");
    const cryptoItem = cryptoItems.find((item) => item.code === forPayment);
    return {
      pair,
      cmcId: cryptoItem ? cryptoItem.cmcId : null,
      currency,
      forPayment,
    };
  });

  const validCryptoData = cryptoData;

  // Запрос цен для каждой пары
  const pricePromises = validCryptoData.map(async (data) => {
    if (data.cmcId) {
      return getCryptoPrice(data.cmcId, data.currency);
    } else {
      const usdtPrice = await getCryptoPrice(825, data.currency);
      const forPaymentPrice = await getCryptoPrice(825, data.forPayment);
      return usdtPrice / forPaymentPrice;
    }
  });
  const prices = await Promise.all(pricePromises);

  // Создание мапы для быстрого доступа к ценам
  const priceMap = {};
  validCryptoData.forEach((data, index) => {
    priceMap[data.pair] = prices[index];
  });

  // Расчет цен для офферов с interestPrice
  for (const offer of offers) {
    if (offer.interestPrice) {
      const pair = `${offer.forPayment}-${offer.currency}`;
      const cryptoPrice = priceMap[pair];

      if (cryptoPrice) {
        offer.price = offer.interestPrice * 100 * cryptoPrice;
      } else {
        offer.price =
          offer.interestPrice *
          100 *
          priceMap[pair.split("-").reverse().join("-")];
      }
    }
  }

  return offers;
};

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
      console.log(666, currency, forPayment, req.user.id);
      const existingOffer = await Offer.findOne({
        currency,
        forPayment,
        seller: req.user.id,
      });
      if (existingOffer) {
        return res.status(409).json({
          errorCode: "OFFER_CONFLICT",
          message: "У вас уже существует оффер с данной валютой",
        });
      }
      const user = await User.findOne({ _id: req.user.id });

      const offer = new Offer({
        seller: mongoose.Types.ObjectId(req.user.id),
        currency,
        quantity,
        minQuantity,
        price,
        comment,
        typeOfPrice,
        interestPrice,
        paymentMethods,
        createdAt: Date.now(),
        forPayment,
        location: user.location,
        disableTrading: user.disableTrading,
        delivery,
        applications: [],
      });
      await offer.save();
      return res.json({ message: "Офер успешно создан", offerId: offer.id });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Offer create error", err: e });
    }
  }
  async editOffer(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при обновлении", errors });
      }
      const {
        _id,
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

      const offer = await Offer.findOne({ _id, seller: req.user.id });
      if (!offer) {
        return res.status(404).json({ message: "Оффер не найден" });
      }

      const existingOffer = await Offer.findOne({
        _id: { $ne: _id },
        seller: req.user.id,
        currency,
        forPayment,
      });

      if (existingOffer) {
        return res.status(409).json({
          errorCode: "OFFER_CONFLICT",
          message: "У вас уже есть оффер с такими же параметрами",
        });
      }

      offer.currency = currency;
      offer.quantity = quantity;
      offer.price = price;
      offer.forPayment = forPayment;
      offer.delivery = delivery;
      offer.minQuantity = minQuantity;
      offer.typeOfPrice = typeOfPrice;
      offer.interestPrice = interestPrice;
      offer.paymentMethods = paymentMethods;
      offer.comment = comment;

      await offer.save();
      return res.json({ message: "Оффер успешно обновлен", offerId: offer.id });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Offer update error", err: e });
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
      filter.seller = { $ne: mongoose.Types.ObjectId(req.user.id) };
      filter.disableTrading = { $ne: true };

      let offers;
      if (
        user &&
        user.location &&
        user.location.coordinates &&
        req.query.distance
      ) {
        const userCoordinates = user.location.coordinates;
        const maxDistance = parseInt(req.query.distance);

        offers = await Offer.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [userCoordinates[0], userCoordinates[1]],
              },
              distanceField: "distance",
              maxDistance: maxDistance,
              spherical: true,
              query: filter,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "seller",
              foreignField: "_id",
              as: "sellerData",
            },
          },
          {
            $unwind: {
              path: "$sellerData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              "sellerData.allowsWriteToPm": 0,
              "sellerData.__v": 0,
              "sellerData.telegramId": 0,
              "sellerData.location": 0,
              "sellerData.chatId": 0,
              "sellerData.authDate": 0,
              "location.coordinates": 0,
            },
          },
          {
            $addFields: {
              distance: { $round: ["$distance", 0] },
            },
          },
        ]);
      } else {
        offers = await Offer.aggregate([
          { $match: filter },
          {
            $lookup: {
              from: "users",
              localField: "seller",
              foreignField: "_id",
              as: "sellerData",
            },
          },
          {
            $unwind: "$sellerData",
          },
        ]);
      }
      const updatedOffers = await calculateOfferPrices(offers);
      const sortedOffers = updatedOffers.sort((a, b) => b.price - a.price);

      res.json(sortedOffers);
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

      const user = await User.findOne({ _id: req.user.id });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Пользователь не найден", errors });
      }

      const userCoordinates = user.location?.coordinates;
      const offerId = mongoose.Types.ObjectId(req.params.offerId);

      if (userCoordinates) {
        const offers = await Offer.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: userCoordinates,
              },
              distanceField: "distance",
              spherical: true,
              query: { _id: offerId },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "seller",
              foreignField: "_id",
              as: "sellerData",
            },
          },
          {
            $unwind: {
              path: "$sellerData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              "sellerData.allowsWriteToPm": 0,
              "sellerData.__v": 0,
              "sellerData.telegramId": 0,
              "sellerData.location": 0,
              "sellerData.chatId": 0,
              "sellerData.authDate": 0,
              "location.coordinates": 0,
            },
          },
          {
            $addFields: {
              distance: { $round: ["$distance", 0] },
            },
          },
        ]);

        if (!offers.length) {
          return res.status(404).json({ message: "Offer не найден", errors });
        }
        const updatedOffers = await calculateOfferPrices(offers);
        res.json(updatedOffers[0]);
      } else {
        const offer = await Offer.findOne({ _id: offerId }).populate(
          "seller",
          " -allowsWriteToPm -__v -telegramId -location -chatId -authDate"
        );

        if (!offer) {
          return res.status(404).json({ message: "Offer не найден", errors });
        }
        if (offer.location) {
          offer.location = {
            ...offer.location.toObject(),
            coordinates: undefined,
          };
        }
        const updatedOffers = await calculateOfferPrices([offer]);
        res.json(updatedOffers[0]);
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }

  async getMyOffers(req, res) {
    try {
      const userId = mongoose.Types.ObjectId(req.user.id);

      const myOffers = await Offer.aggregate([
        { $match: { seller: userId } },
        {
          $lookup: {
            from: "users",
            localField: "seller",
            foreignField: "_id",
            as: "sellerData",
          },
        },
        {
          $unwind: {
            path: "$sellerData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            "sellerData.allowsWriteToPm": 0,
            "sellerData.__v": 0,
            "sellerData.telegramId": 0,
            "sellerData.location": 0,
            "sellerData.chatId": 0,
            "sellerData.authDate": 0,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      const updatedOffers = await calculateOfferPrices(myOffers);

      res.json(updatedOffers);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Server error" });
    }
  }

  deliteOffer = async (req, res) => {
    const { offerId } = req.body;
    const userId = req.user.id;

    try {
      const offer = await Offer.findById(offerId);
      if (!offer) {
        return res.status(400).json({ message: "Заявка не найдена" });
      }

      if (offer.seller.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Вы не имеете прав для удаления этого объявления" });
      }

      await Application.deleteMany({
        offerId,
        status: { $nin: ["COMPLETED"] },
      });
      await offer.remove();

      res.status(200).json({ message: "success" });
    } catch (e) {
      // console.log(e);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  };
}

module.exports = new offerController();
