const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const config = require("config");
const cronJobs = require("./cronJobs");
const fs = require("fs");
const https = require("https");
const { createServer } = require("http");

const { initializeSocket } = require("./socketHandler");

const PORT = config.get("PORT");

const authRouter = require("./sections/auth/authRouter");
const offerRouter = require("./sections/offer/offerRouter");
const verificationRouter = require("./sections/tonConnectVerification/verificationRouter");
const currencyApiRouter = require("./sections/currencyApi/currencyApiRouter");
const applicationApiRouter = require("./sections/application/applicationApiRouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/offer", offerRouter);
app.use("/verify", verificationRouter);
app.use("/currency", currencyApiRouter);
app.use("/application", applicationApiRouter);

const isProduction = process.env.NODE_ENV === "production";
console.log(111111, isProduction);

let server;
if (isProduction) {
  const privateKey = fs.readFileSync("/etc/ssl/private/privatekey.pem", "utf8");
  const certificate = fs.readFileSync(
    "/etc/ssl/certs/pocketmoneytgru.pem",
    "utf8"
  );
  const credentials = { key: privateKey, cert: certificate };
  server = https.createServer(credentials, app);
} else {
  server = createServer(app);
}

const start = async () => {
  try {
    await mongoose
      .connect(config.get("dbUrl"), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.error("MongoDB connection error:", err));
    app.use(express.static(__dirname));
    app.use(express.static(path.resolve(__dirname, "../client/build")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build", "index.html"));
    });

    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

    initializeSocket(server);
  } catch (e) {
    console.log(e);
  }
};

start();
