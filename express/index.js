const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const config = require("config");
const fs = require("fs");
const https = require("https");
const PORT = process.env.PORT || config.get("PORT");
// const { Server } = require("socket.io");

const authRouter = require("./sections/auth/authRouter");
const chatRouter = require("./sections/chat/chatRouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/chat", chatRouter);

const token = "7048530034:AAHBxVCmGKbg2bBgZrTsKzRzt3Wk_6xoMUY";

const webhookUrl = "https://pocketmoneytg.ru";

const privateKey = fs.readFileSync("/etc/ssl/private/privatekey.pem", "utf8");
const certificate = fs.readFileSync(
  "/etc/ssl/certs/pocketmoneytgru.pem",
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };
const start = async () => {
  try {
    await mongoose.connect(config.get("dbUrl"));
    app.use(express.static(__dirname));
    app.use(express.static(path.resolve(__dirname, "../client/build")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build", "index.html"));
    });

    // const privateKey = fs.readFileSync("/etc/ssl/private/privatekey.pem", "utf8");
    // const certificate = fs.readFileSync("/etc/ssl/certs/pocketmoneytgru.pem", "utf8");
    // const credentials = { key: privateKey, cert: certificate };

    const httpsServer = https.createServer(credentials, app);

    //  const io = new Server(httpsServer);

    // io.on("connection", (socket) => {
    //   socket.on("addMessage", (data) => {
    //     io.emit("addMessage", data);
    //   });
    //   socket.on("chatCreated", (data) => {
    //     io.emit("chatCreated", data);
    //   });
    // });

    httpsServer.listen(PORT, () => {
      console.log(`HTTPS Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

const { Server } = require("socket.io");
const httpsServer = https.createServer(credentials, app);
const io = new Server(httpsServer);

io.on("connection", (socket) => {
  socket.on("addMessage", (data) => {
    io.emit("addMessage", data);
  });
  socket.on("chatCreated", (data) => {
    io.emit("chatCreated", data);
  });
});

// Создаем экземпляр бота
const bot = new TelegramBot(token);

bot.setWebHook(`${webhookUrl}/bot${token}`);

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(111111, chatId, msg);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const url = webhookUrl;
  const inlineKeyboardMarkup = {
    inline_keyboard: [[{ text: "Открыть в TMA", url }]],
  };

  bot.sendMessage(chatId, "Нажмите кнопку, чтобы открыть приложение", {
    reply_markup: inlineKeyboardMarkup,
  });
});

app.post("/bot7048530034:AAHBxVCmGKbg2bBgZrTsKzRzt3Wk_6xoMUY", (req, res) => {
  const { message } = req.body;

  if (message && message.text === "/start") {
    // Логика обработки команды /start
    bot.sendMessage(message.chat.id, "Привет! Добро пожаловать!");
  } else {
    // Обработка других типов сообщений
  }

  res.sendStatus(200); // Отправляем статус успеха
});

bot.on("inline_query", (query) => {
  const url = webhookUrl;
  const inlineKeyboardMarkup = {
    inline_keyboard: [[{ text: "Открыть в TMA", url }]],
  };

  const results = [
    {
      type: "article",
      id: "1",
      title: "Открыть в TMA",
      input_message_content: {
        message_text: "Откройте веб-приложение в Telegram Mini-App",
        parse_mode: "Markdown",
      },
      reply_markup: inlineKeyboardMarkup,
    },
  ];

  bot.answerInlineQuery(query.id, results);
});

start();
