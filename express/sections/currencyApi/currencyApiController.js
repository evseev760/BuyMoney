const axios = require("axios");
const Currency = require("../../models/Currency");
const Cripto = require("../../models/Cripto");
const config = require("config");
const { getCryptoPrice } = require("../../utils/apiService");

const { validationResult } = require("express-validator");

// const conf = {
//   headers: {
//     "X-CMC_PRO_API_KEY": config.get("X-CMC_PRO_API_KEY"),
//   },
// };

// async function getCryptoPrice(cryptoCurrency, currency) {
//   try {
//     const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${cryptoCurrency}&convert=${currency}`;
//     const response = await axios.get(url, conf);
//     const price = response.data;

//     return price;
//   } catch (error) {
//     console.error("Ошибка при получении цены криптовалюты:", error);
//     throw error; // Пробрасываем ошибку дальше, чтобы обработать ее на уровне вызывающего кода
//   }
// }

async function getCurrenciesApi() {
  try {
    const url = `https://pro-api.coinmarketcap.com/v1/fiat/map`;
    const response = await axios.get(url, conf);
    const currencies = response.data.data;

    return currencies;
  } catch (error) {
    console.error("Ошибка при получении валюты:", error);
    throw error;
  }
}

async function getCriptoCurrenciesApi(isCripto) {
  try {
    const conf = {
      headers: {
        "X-CMC_PRO_API_KEY": config.get("X-CMC_PRO_API_KEY"),
      },
    };
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map`;
    const fiatUrl = "https://pro-api.coinmarketcap.com/v1/fiat/map";
    const response = await axios.get(isCripto ? url : fiatUrl, conf);
    const currencies = response.data.data;
    console.log(currencies.filter((item) => item.symbol === "TON"));
    return currencies;
  } catch (error) {
    console.error("Ошибка при получении валюты:", error);
    throw error;
  }
}

class currencyApiController {
  async getPrice(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка запроса", errors });
      }
      const crypto = await Cripto.findOne({ code: req.query.crypto });

      const fiat = await Currency.findOne({ code: req.query.fiat });

      if (!crypto) {
        return res.status(400).json({ message: "Криптовалюта  не найдена" });
      }

      const response = await getCryptoPrice(crypto.cmcId, req.query.fiat);

      const result = {
        price: response,
      };

      res.json(result);
    } catch (e) {
      console.log(e);
    }
  }

  async getPriceFiat(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка запроса", errors });
      }
      const { crypto, first, second } = req.query;

      const cryptoItem = await Cripto.findOne({ code: crypto });

      if (!cryptoItem) {
        return res
          .status(400)
          .json({ message: "Криптовалюта или валюта не найдены" });
      }
      const [firstPrice, secondPrice] = await Promise.all([
        getCryptoPrice(cryptoItem.cmcId, first),
        getCryptoPrice(cryptoItem.cmcId, second),
      ]);

      const result = {
        price: firstPrice / secondPrice,
      };
      res.json(result);
    } catch (e) {
      // console.log(e);
    }
  }

  async getCurrencies(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка запроса", errors });
      }
      const currencies = await Currency.find();
      res.json(currencies);
    } catch (e) {
      console.log(e);
    }
  }

  async getCripto(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка запроса", errors });
      }
      const currencies = await Cripto.find();
      res.json(currencies);
    } catch (e) {
      console.log(e);
    }
  }

  async setCurrencies(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка запроса", errors });
      }
      const { data } = req.body;

      const criptoArr = await getCriptoCurrenciesApi(true);
      const fiatArr = await getCriptoCurrenciesApi(false);

      for (const currency of data.cripto) {
        const foundCurrency = criptoArr.find(
          (item) => item.slug === currency.code
        );
        if (foundCurrency) {
          await Cripto.create({
            cmcId: foundCurrency.id,
            name: foundCurrency.name,
            slug: foundCurrency.slug,
            symbol: foundCurrency.symbol,
            label: currency.label,
            code: foundCurrency.slug,
            paymentMethodsList: currency.paymentMethodsList,
          });
        } else {
          console.log(5555, currency.label);
        }
      }
      for (const fiat of data.fiat) {
        const foundFiat = fiatArr.find((item) => item.symbol === fiat.label);
        if (foundFiat) {
          await Currency.create({
            cmcId: foundFiat.id,
            name: foundFiat.name,
            sign: foundFiat.sign,
            symbol: foundFiat.symbol,
            label: fiat.label,
            code: fiat.label,
            paymentMethodsList: fiat.paymentMethodsList,
          });
        } else {
          console.log(6666, fiat.label);
        }
      }

      res.json({});
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new currencyApiController();
