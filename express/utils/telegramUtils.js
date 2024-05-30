// const telegramBot = require("../telegramBot");
const Currency = require("../models/Currency");
const Cripto = require("../models/Cripto");

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
    💸 К оплате: ${forPaymentItem.label}` +
    (paymentMethodItem
      ? `💳 Способ оплаты: ${paymentMethodItem}
    `
      : "") +
    `👤 Покупатель: ${buyerUser.username}`;

  const sentMessage = await telegramBot.sendMessage(
    sellerUser.telegramId,
    message,
    {
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

module.exports = {
  sendApplicationMessage,
  editApplicationMessage,
  deliteApplicationMessage,
};
