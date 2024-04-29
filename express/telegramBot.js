// const TelegramBot = require("node-telegram-bot-api");
// const config = require("config");
// const token = config.get("BOT_TOKEN");
// const User = require("./models/User");

// const webAppUrl = config.get("APP_URL");
// // const webAppUrl = "https://1fc1-42-114-18-147.ngrok-free.app";

// const bot = new TelegramBot(token, { polling: true });
// // bot.telegram.setWebhook(`${webAppUrl}/bot${token}`);

// async function requestLocation(chatId) {
//   await bot.sendMessage(chatId, "Пожалуйста, отправьте свою геолокацию.", {
//     reply_markup: {
//       keyboard: [[{ text: "Отправить геолокацию", request_location: true }]],
//       resize_keyboard: true,
//       one_time_keyboard: true,
//     },
//   });
// }
// module.exports = { requestLocation };

// bot.on("message", async (msg) => {
//   const chatId = msg.chat.id;
//   const text = msg.text;
//   if (text === "/start") {
//     try {
//       // Проверяем, есть ли пользователь с таким telegramId в базе данных
//       let user = await User.findOne({ telegramId: msg.chat.id });

//       if (user) {
//         // Если пользователь уже существует в базе, обновляем его chatId
//         await User.updateOne({ telegramId: msg.chat.id }, { chatId: chatId });
//       } else {
//         // Если пользователь еще не существует, создаем нового и добавляем его в базу
//         user = new User({
//           telegramId: msg.chat.id,
//           firstName: msg.chat.first_name,
//           lastName: msg.chat.last_name,
//           username: msg.chat.username,
//           languageCode: msg.from.language_code,
//           allowsWriteToPm: true, // Здесь можете установить значение по умолчанию
//           authDate: new Date(),
//           chatId: chatId,
//         });
//         await user.save();
//       }

//       // Отправляем сообщение пользователю
//       bot.sendMessage(chatId, "Добро пожаловать! Отправьте свою геолокацию.", {
//         reply_markup: {
//           keyboard: [
//             [{ text: "Отправить геолокацию", request_location: true }],
//           ],
//           resize_keyboard: true,
//           one_time_keyboard: true,
//         },
//       });
//     } catch (error) {
//       console.error("Ошибка при обработке команды /start:", error);
//       bot.sendMessage(chatId, "Произошла ошибка при обработке вашего запроса.");
//     }
//   }
// });
// bot.on("location", async (msg) => {
//   const chatId = msg.chat.id;
//   const latitude = msg.location.latitude;
//   const longitude = msg.location.longitude;

//   try {
//     // Найдем пользователя по его telegramId и обновим его местоположение
//     const user = await User.findOneAndUpdate(
//       { telegramId: chatId },
//       { location: `${latitude},${longitude}` }, // Обновляем поле location с координатами
//       { new: true } // Устанавливаем опцию new, чтобы получить обновленный документ
//     );

//     if (user) {
//       console.log(
//         `Местоположение пользователя ${user.firstName} успешно обновлено.`
//       );
//     } else {
//       console.log(`Пользователь с telegramId ${chatId} не найден.`);
//     }

//     // Отправляем сообщение пользователю о успешном обновлении местоположения
//     bot.sendMessage(chatId, "Спасибо за ваше местоположение!");
//   } catch (error) {
//     console.error("Ошибка при обновлении местоположения пользователя:", error);
//     // Отправляем сообщение об ошибке пользователю
//     bot.sendMessage(
//       chatId,
//       "Произошла ошибка при обновлении вашего местоположения. Попробуйте еще раз позже."
//     );
//   }
// });

// module.exports = bot;
