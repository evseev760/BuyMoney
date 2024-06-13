const i18next = require("../i18n");
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
const fixNumber = (formattedValue) => {
  const parts = String(formattedValue).split(".");
  let integerPart = parts[0];
  let decimalPart = parts[1] || "";

  const significantDigitsBeforeDecimal = integerPart.replace(/^0+/, "").length;

  if (significantDigitsBeforeDecimal > 0) {
    decimalPart = decimalPart.slice(0, 2);
  } else {
    const firstSignificantDigitIndex = decimalPart.search(/[1-9]/);
    if (firstSignificantDigitIndex !== -1) {
      decimalPart = decimalPart.slice(0, firstSignificantDigitIndex + 4);
    } else {
      decimalPart = "";
    }
  }

  decimalPart = decimalPart.replace(/0+$/, "");

  const result = integerPart + (decimalPart ? `.${decimalPart}` : "");
  return result;
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
  await i18next.changeLanguage(sellerUser.languageCode);
  const message =
    `${i18next.t("application_message.new_application")}
    💰 ${i18next.t("application_message.quantity", {
      quantity: `${fixNumber(application.quantity)} ${currencyItem.label}`,
    })}
    💸 ${i18next.t("application_message.for_payment", {
      forPaymentLabel: `${fixNumber(
        (1 / application.price) * application.quantity
      )} ${forPaymentItem.label}`,
    })}
    ` +
    (paymentMethodItem
      ? `💳 ${i18next.t("application_message.payment_method", {
          paymentMethod: paymentMethodItem,
        })}
    `
      : "") +
    `👤 ${i18next.t("application_message.buyer", {
      username: buyerUser.nickname,
    })}`;

  const sentMessage = await telegramBot.sendMessage(
    sellerUser.telegramId,
    message,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "✅ Принять заявку",
              callback_data: `${application._id}`,
            },
          ],
        ],
      },
    }
  );

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
  await i18next.changeLanguage(sellerUser.languageCode);
  const newKeyboard = {
    inline_keyboard: [
      [
        {
          text: `💬 ${i18next.t("go_to_buyer_chat")}`,
          url: buyerChatUrl,
        },
      ],
    ],
  };

  if (application.messageId.seller) {
    await telegramBot.editMessageReplyMarkup(newKeyboard, {
      chat_id: sellerUser.telegramId,
      message_id: application.messageId.seller,
    });
  }

  await i18next.changeLanguage(buyerUser.languageCode);
  const buyerMessage = i18next.t("application_message.accepted", {
    quantity: application.quantity,
    currency: application.currency,
  });
  const sentMessage = await telegramBot.sendMessage(
    buyerUser.telegramId,
    buyerMessage,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `💬 ${i18next.t("go_to_seller_chat")}`,
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
    await i18next.changeLanguage(sellerUser.languageCode);
    let newKeyboard = {
      inline_keyboard: [
        [
          {
            text: i18next.t("application_message.deleted"),
            callback_data: "!",
          },
        ],
      ],
    };

    if (application.messageId.seller) {
      await telegramBot.editMessageReplyMarkup(newKeyboard, {
        chat_id: sellerUser.telegramId,
        message_id: application.messageId.seller,
      });
    }
    await i18next.changeLanguage(buyerUser.languageCode);
    newKeyboard = {
      inline_keyboard: [
        [
          {
            text: i18next.t("application_message.deleted"),
            callback_data: "!",
          },
        ],
      ],
    };
    if (application.messageId.buyer) {
      await telegramBot.editMessageReplyMarkup(newKeyboard, {
        chat_id: buyerUser.telegramId,
        message_id: application.messageId.buyer,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const phoneNumberInstructions = async (bot, chatId) => {
  await bot.sendMessage(chatId, i18next.t("send_phone_instructions"), {
    reply_markup: {
      keyboard: [
        [{ text: i18next.t("share_phone_button"), request_contact: true }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
};

module.exports = {
  sendApplicationMessage,
  editApplicationMessage,
  deliteApplicationMessage,
  getUserChatUrl,
  phoneNumberInstructions,
};
