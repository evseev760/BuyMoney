const TelegramBot = require("node-telegram-bot-api");
const config = require("config");
const token = config.get("BOT_TOKEN");
const User = require("./models/User");
const Offer = require("./models/Offer");
const Application = require("./models/Application");
const { default: axios } = require("axios");

const webAppUrl = config.get("APP_URL");
// const webAppUrl = "https://1fc1-42-114-18-147.ngrok-free.app";
const getAvatar = async (id) => {
  const result = await axios(
    `https://api.dicebear.com/8.x/shapes/svg?size=96&seed=${id}`
  );
  return result.data;
};
const getGeolocationData = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await axios.get(url);
    if (response.data) {
      const result = response.data;
      console.log(result.display_name); // Full address
      console.log(`Country: ${result.address.country}`);
      console.log(
        `City: ${
          result.address.city || result.address.town || result.address.village
        }`
      );
      return result;
    } else {
      console.log("No results found");
    }
  } catch (error) {
    console.error("Error getting geolocation data:", error);
  }
};

const bot = new TelegramBot(token, { polling: true });
// bot.telegram.setWebhook(`${webAppUrl}/bot${token}`);

async function requestLocation(chatId) {
  await bot.sendMessage(chatId, "Пожалуйста, отправьте свою геолокацию.", {
    reply_markup: {
      keyboard: [[{ text: "Отправить геолокацию", request_location: true }]],
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
        // Если пользователь уже существует в базе, обновляем его chatId
        await User.updateOne({ telegramId: msg.chat.id }, { chatId: chatId });
      } else {
        const avatar = await getAvatar(msg.chat.id);
        // Если пользователь еще не существует, создаем нового и добавляем его в базу
        user = new User({
          telegramId: msg.chat.id,
          firstName: msg.chat.first_name,
          lastName: msg.chat.last_name,
          username: msg.chat.username,
          languageCode: msg.from.language_code,
          allowsWriteToPm: true, // Здесь можете установить значение по умолчанию
          authDate: new Date(),
          chatId: chatId,
          avatar,
        });
        await user.save();
      }

      // Отправляем сообщение пользователю
      bot.sendMessage(chatId, "Добро пожаловать! Отправьте свою геолокацию.", {
        reply_markup: {
          keyboard: [
            [{ text: "Отправить геолокацию", request_location: true }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    } catch (error) {
      console.error("Ошибка при обработке команды /start:", error);
      bot.sendMessage(chatId, "Произошла ошибка при обработке вашего запроса.");
    }
  }
});
bot.on("callback_query", async (query) => {
  const data = query.data;
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const application = await Application.findOneAndUpdate(
    { _id: data },
    { status: "PENDING" },
    { new: true }
  );
  const buyerUser = await User.findOne({ _id: application.user });
  const sellerUser = await User.findOne({ _id: application.seller });
  const buyerChatUrl = `https://t.me/${buyerUser.username}`;
  const sellerChatUrl = `https://t.me/${sellerUser.username}`;

  const newKeyboard = {
    inline_keyboard: [
      [
        {
          text: "💬 Перейти к чату с покупателем",
          url: buyerChatUrl,
        },
      ],
    ],
  };
  bot.editMessageReplyMarkup(newKeyboard, {
    chat_id: chatId,
    message_id: messageId,
  });
  const buyerMessage = `Заявка на сумму ${application.quantity} ${application.currency} принята, доступен чат с продавцом!`;
  bot.sendMessage(buyerUser.telegramId, buyerMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "💬 Перейти к чату с продавцом",
            url: sellerChatUrl,
          },
        ],
      ],
    },
  });
});

bot.on("location", async (msg) => {
  const chatId = msg.chat.id;
  const latitude = msg.location.latitude;
  const longitude = msg.location.longitude;
  const geolocationData = await getGeolocationData(latitude, longitude);
  try {
    const user = await User.findOneAndUpdate(
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
        { mainUser: user._id }, // Находим все офферы этого пользователя
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
        `Местоположение пользователя ${user.firstName} успешно обновлено.`
      );
    } else {
      const avatar = await getAvatar(msg.chat.id);
      // Если пользователь еще не существует, создаем нового и добавляем его в базу
      const newUser = new User({
        telegramId: msg.chat.id,
        firstName: msg.chat.first_name,
        lastName: msg.chat.last_name,
        username: msg.chat.username,
        languageCode: msg.from.language_code,
        allowsWriteToPm: true, // Здесь можете установить значение по умолчанию
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
      });
      await newUser.save();
      console.log(`Пользователь с telegramId ${chatId} не найден.`);
    }

    // Отправляем сообщение пользователю о успешном обновлении местоположения
    bot.sendMessage(chatId, "Спасибо! Местоположение упешно обновлено!");
  } catch (error) {
    console.error("Ошибка при обновлении местоположения пользователя:", error);
    // Отправляем сообщение об ошибке пользователю
    bot.sendMessage(
      chatId,
      "Произошла ошибка при обновлении вашего местоположения. Попробуйте еще раз позже."
    );
  }
});

module.exports = bot;
