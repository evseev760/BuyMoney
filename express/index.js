const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const config = require("config");
const fs = require("fs");
const compression = require("compression");
const { createServer } = require("http");
const i18next = require("./i18n");
const middleware = require("i18next-http-middleware");

const { initializeSocket } = require("./socketHandler");

const authRouter = require("./sections/auth/authRouter");
const offerRouter = require("./sections/offer/offerRouter");
const verificationRouter = require("./sections/tonConnectVerification/verificationRouter");
const currencyApiRouter = require("./sections/currencyApi/currencyApiRouter");
const applicationApiRouter = require("./sections/application/applicationApiRouter");

const app = express();

app.use(middleware.handle(i18next));
app.use(cors());
app.use(express.json());
app.use(compression());

app.use("/api/auth", authRouter);
app.use("/api/offer", offerRouter);
app.use("/api/verify", verificationRouter);
app.use("/api/currency", currencyApiRouter);
app.use("/api/application", applicationApiRouter);

const isProduction = process.env.NODE_ENV === "production";

let server;
let dbUrl;
let PORT;

if (isProduction) {
  dbUrl = config.get("dbUrlProd");
  PORT = config.get("PORT_PROD");
} else {
  dbUrl = config.get("dbUrl");
  PORT = config.get("PORT");

  // В dev среде, обрабатываем статические файлы через express.static
  app.use(express.static(path.resolve(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    const filePath = path.resolve(__dirname, "../client/build", "index.html");
    fs.stat(filePath, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          res
            .status(404)
            .sendFile(path.join(__dirname, "./public", "notFound.html"));
        } else {
          res.status(500).send("Internal Server Error");
        }
      } else {
        res.sendFile(filePath);
      }
    });
  });

  app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "./public", "notFound.html"));
  });
}

const start = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected");

    server = createServer(app);
    server.listen(PORT, () =>
      console.log(
        `Server started on port ${PORT} in ${
          isProduction ? "production" : "development"
        } mode`
      )
    );

    initializeSocket(server);
  } catch (e) {
    console.error("Error starting server:", e);

    app.use((req, res, next) => {
      res
        .status(500)
        .sendFile(path.join(__dirname, "./public", "notFound.html"));
    });
  }
};

start();
