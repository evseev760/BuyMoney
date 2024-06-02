// const telegramBot = require("../telegramBot");
const Currency = require("../models/Currency");
const Cripto = require("../models/Cripto");

const getUserChatUrl = (user) => {
  if (user.username) {
    return `https://t.me/${user.username}`;
  } else if (user.phoneNumber) {
    return `https://t.me/+${user.phoneNumber}`;
  } else {
    return null;
  }
};

const sendApplicationMessage = async (
  telegramBot,
  application,
  sellerUser,
  buyerUser
) => {
  const currencyItem = await Currency.findOne({ code: application.currency });
  let forPaymentItem = await Cripto.findOne({ code: application.forPayment });
  if (!forPaymentItem) {
    forPaymentItem = await Currency.findOne({ code: application.forPayment });
  }
  const paymentMethodItem = forPaymentItem?.paymentMethodsList?.find(
    (item) => item.code === application.paymentMethod
  )?.label;

  const message =
    `У вас новая заявка!
    🏷️ Цена: ${application.price}
    💰 Сумма: ${application.quantity}
    💱 Валюта: ${currencyItem.label}
    💸 К оплате: ${forPaymentItem.label}
    ` +
    (paymentMethodItem
      ? `💳 Способ оплаты: ${paymentMethodItem}
    `
      : "") +
    `👤 Покупатель: ${
      buyerUser.ratings.average.toFixed(2) +
      "/" +
      buyerUser.ratings.count +
      " ⭐"
    }`;

  const sentMessage = await telegramBot.sendMessage(
    sellerUser.telegramId,
    message,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "	✅ Принять заявку",
              callback_data: `${application._id}`,
            },
          ],
        ],
      },
    }
  );

  // Сохраняем chatId и messageId в заявке
  application.messageId = {
    seller: sentMessage.message_id,
  };
  await application.save();
};

const editApplicationMessage = async (
  telegramBot,
  application,
  buyerUser,
  sellerUser
) => {
  const buyerChatUrl = getUserChatUrl(buyerUser);
  const sellerChatUrl = getUserChatUrl(sellerUser);

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

  // Редактируем сообщение в чате продавца
  await telegramBot.editMessageReplyMarkup(newKeyboard, {
    chat_id: sellerUser.telegramId,
    message_id: application.messageId.seller,
  });

  // Отправляем сообщение покупателю
  const buyerMessage = `Заявка на сумму ${application.quantity} ${application.currency} принята, доступен чат с продавцом!`;
  const sentMessage = await telegramBot.sendMessage(
    buyerUser.telegramId,
    buyerMessage,
    {
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
    }
  );
  application.messageId = {
    buyer: sentMessage.message_id,
    seller: application.messageId.seller,
  };
  await application.save();
};

const deliteApplicationMessage = async (
  telegramBot,
  application,
  buyerUser,
  sellerUser
) => {
  try {
    const newKeyboard = {
      inline_keyboard: [
        [
          {
            text: "Заявка была удалена",
            callback_data: "!",
          },
        ],
      ],
    };

    // Редактируем сообщение в чате продавца
    if (application.messageId.seller) {
      await telegramBot.editMessageReplyMarkup(newKeyboard, {
        chat_id: sellerUser.telegramId,
        message_id: application.messageId.seller,
      });
    }

    await telegramBot.editMessageReplyMarkup(newKeyboard, {
      chat_id: buyerUser.telegramId,
      message_id: application.messageId.buyer,
    });
  } catch (error) {
    console.log(error);
  }
};

const phoneNumberInstructions = async (bot, chatId) => {
  await bot.sendMessage(
    chatId,
    "Чтобы отправить свой номер телефона, нажмите на кнопку 'Поделиться номером' ниже.",
    {
      reply_markup: {
        keyboard: [[{ text: "Поделиться номером", request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
};

module.exports = {
  sendApplicationMessage,
  editApplicationMessage,
  deliteApplicationMessage,
  getUserChatUrl,
  phoneNumberInstructions,
};
