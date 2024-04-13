const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const config = require("config");
const fs = require("fs");

const https = require("https");
const { Telegraf } = require("telegraf");
const PORT = process.env.PORT || config.get("PORT");
const authRouter = require("./sections/auth/authRouter");
const chatRouter = require("./sections/chat/chatRouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/chat", chatRouter);

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

    const httpsServer = https.createServer(credentials, app);

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

const token = "bot***REMOVED***";
const bot = new Telegraf(token);

bot.telegram.setWebhook(`${webhookUrl}/bot${token}`);

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(111111, chatId, msg);
});

bot.on("text", (ctx) => {
  const { message } = ctx;
  const chatId = message.chat.id;
  const url = webhookUrl;
  const inlineKeyboardMarkup = {
    inline_keyboard: [[{ text: "Открыть в TMA", url }]],
  };

  ctx.reply("Нажмите кнопку, чтобы открыть приложение", {
    reply_markup: inlineKeyboardMarkup,
  });
});

app.post(`/bot${token}`, (req, res) => {
  const { message } = req.body;
  if (message && message.text === "/start") {
    bot.telegram.sendMessage(message.chat.id, "Привет! Добро пожаловать!");
  }
  res.sendStatus(200);
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
