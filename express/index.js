const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const config = require("config");
const { createServer } = require("http");
const fs = require("fs");
const https = require("https");
const { Server } = require("socket.io");

const PORT = process.env.PORT || config.get("PORT");

const authRouter = require("./sections/auth/authRouter");
const offerRouter = require("./sections/offer/offerRouter");
const verificationRouter = require("./sections/tonConnectVerification/verificationRouter");
const currencyApiRouter = require("./sections/currencyApi/currencyApiRouter");
const applicationApiRouter = require("./sections/application/applicationApiRouter");
const telegramBot = require("./telegramBot");
// const socketHandler = require("./socketHandler");

const app = express();

const httpServer = createServer(app);
// const io = new Server(httpServer);

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/offer", offerRouter);
app.use("/verify", verificationRouter);
app.use("/currency", currencyApiRouter);
app.use("/application", applicationApiRouter);

const webhookUrl = config.get("APP_URL");

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
    // app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(PORT, () => {
      console.log(`HTTPS Server started on port ${PORT}`);
    });
    // socketHandler(io);
  } catch (e) {
    console.log(e);
  }
};

start();
httpServer.listen(config.get("WS_PORT"));
