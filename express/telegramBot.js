const TelegramBot = require("node-telegram-bot-api");
const config = require("config");

const User = require("./models/User");
const Offer = require("./models/Offer");
const i18next = require("./i18n");
const Application = require("./models/Application");
const { getAvatar, getGeolocationData } = require("./utils/apiService");
const { editApplicationMessage } = require("./utils/telegramUtils");
const { generateNickname } = require("./utils/generateNickname");
const { sendApplicationStatusUpdate } = require("./socketHandler");
const isProduction = process.env.NODE_ENV === "production";
const webAppUrl = config.get(isProduction ? "APP_URL_PROD" : "APP_URL");
const token = config.get(isProduction ? "BOT_TOKEN_PROD" : "BOT_TOKEN");
const bot = new TelegramBot(token, { polling: true });
// bot.telegram.setWebhook(`${webAppUrl}/bot${token}`);

async function requestLocation(chatId) {
  await bot.sendMessage(chatId, i18next.t("request_location"), {
    reply_markup: {
      keyboard: [
        [{ text: i18next.t("send_location_button"), request_location: true }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
}
// module.exports = { requestLocation };

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text === "/start") {
    try {
      // Проверяем, есть ли пользователь с таким telegramId в базе данных
      let user = await User.findOne({ telegramId: msg.chat.id });

      if (user) {
        const updateData = { chatId: chatId };
        if (msg.chat.username && user.username !== msg.chat.username) {
          updateData.username = msg.chat.username;
        }
        await User.updateOne({ telegramId: msg.chat.id }, updateData);
      } else {
        const avatar = await getAvatar(msg.chat.id);
        const nickname = generateNickname();
        // Если пользователь еще не существует, создаем нового и добавляем его в базу
        user = new User({
          telegramId: msg.chat.id,
          username: msg.chat.username,
          languageCode: msg.from.language_code,
          allowsWriteToPm: true,
          authDate: new Date(),
          chatId: chatId,
          avatar,
          nickname,
        });
        await user.save();
      }
      await i18next.changeLanguage(user.languageCode);
      if (!msg.chat.username && !user.phoneNumber) {
        await bot.sendMessage(chatId, i18next.t("phone_number_prompt"), {
          reply_markup: {
            keyboard: [
              [
                {
                  text: i18next.t("share_phone_button"),
                  request_contact: true,
                },
              ],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        });
      } else {
        const noHaveLocation =
          !user.location || !user.location.coordinates.length;
        console.log(5555, user.languageCode);
        await bot.sendMessage(chatId, i18next.t("open_application"));
        await bot.sendMessage(
          chatId,
          i18next.t(
            noHaveLocation ? "request_location" : "update_location_message"
          ),
          {
            reply_markup: {
              keyboard: [
                [
                  {
                    text: i18next.t("send_location_button"),
                    request_location: true,
                  },
                ],
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          }
        );
        if (noHaveLocation) {
          await bot.sendMessage(chatId, i18next.t("send_location_description"));
        }
      }
    } catch (error) {
      console.error("Ошибка при обработке команды /start:", error);
      bot.sendMessage(chatId, i18next.t("request_error"));
    }
  }
});
bot.on("callback_query", async (query) => {
  const data = query.data;
  if (data === "!") return;
  const application = await Application.findOneAndUpdate(
    { _id: data },
    { status: "PENDING" },
    { new: true }
  );
  sendApplicationStatusUpdate(application);
  const buyerUser = await User.findOne({ _id: application.user });
  const sellerUser = await User.findOne({ _id: application.seller });
  await editApplicationMessage(bot, application, buyerUser, sellerUser);
});

bot.on("contact", async (msg) => {
  const chatId = msg.chat.id;
  const phoneNumber = msg.contact.phone_number;

  try {
    const user = await User.findOneAndUpdate(
      { telegramId: chatId },
      { phoneNumber: phoneNumber },
      { new: true }
    );
    await i18next.changeLanguage(user.languageCode);
    if (user) {
      console.log("Номер телефона пользователя успешно обновлен");

      if (!user.location || !user.location.coordinates.length) {
        await bot.sendMessage(
          chatId,
          i18next.t("update_phone_number_ask_location"),
          {
            reply_markup: {
              keyboard: [
                [
                  {
                    text: i18next.t("send_location_button"),
                    request_location: true,
                  },
                ],
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          }
        );
        await bot.sendMessage(chatId, i18next.t("send_location_description"));
      } else {
        await bot.sendMessage(chatId, i18next.t("update_phone_number_success"));
      }
    } else {
      console.error("Пользователь с telegramId не найден:", chatId);
    }
  } catch (error) {
    console.error("Ошибка при обновлении номера телефона пользователя:", error);
    bot.sendMessage(chatId, i18next.t("update_phone_number_error"));
  }
});

bot.on("location", async (msg) => {
  const chatId = msg.chat.id;
  const latitude = msg.location.latitude;
  const longitude = msg.location.longitude;
  const geolocationData = await getGeolocationData(latitude, longitude);
  let user;
  try {
    user = await User.findOneAndUpdate(
      { telegramId: chatId },
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

    if (user) {
      await Offer.updateMany(
        { seller: user._id },
        {
          "location.type": "Point",
          "location.coordinates": [longitude, latitude],
          "location.Country": geolocationData?.address.country,
          "location.City":
            geolocationData?.address.city ||
            geolocationData?.address.town ||
            geolocationData?.address.village,
        }
      );
      console.log(
        `Местоположение пользователя ${user.nickname} успешно обновлено.`
      );
    } else {
      const avatar = await getAvatar(msg.chat.id);
      const nickname = generateNickname();
      const user = new User({
        telegramId: msg.chat.id,

        username: msg.chat.username,
        languageCode: msg.from.language_code,
        allowsWriteToPm: true,
        authDate: new Date(),
        chatId: chatId,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
          Country: geolocationData?.address.country,
          City:
            geolocationData?.address.city ||
            geolocationData?.address.town ||
            geolocationData?.address.village,
        },
        avatar,
        nickname,
      });
      await user.save();
      console.log(`Пользователь с telegramId ${chatId} не найден.`);
    }
    await i18next.changeLanguage(user.languageCode);
    bot.sendMessage(chatId, i18next.t("location_update_success"));
  } catch (error) {
    console.error("Ошибка при обновлении местоположения пользователя:", error);
    bot.sendMessage(chatId, i18next.t("location_update_error"));
  }
});

module.exports = bot;
