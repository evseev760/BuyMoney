const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const config = require("config");
const fs = require("fs");
const https = require("https");
const PORT = process.env.PORT || config.get("PORT");
const { Server } = require("socket.io");

const authRouter = require("./sections/auth/authRouter");
const chatRouter = require("./sections/chat/chatRouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/chat", chatRouter);

const start = async () => {
  try {
    await mongoose.connect(config.get("dbUrl"));
    app.use(express.static(__dirname));
    app.use(express.static(path.resolve(__dirname, "../client/build")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build", "index.html"));
    });

    const privateKey = fs.readFileSync("/etc/ssl/private/privatekey.pem", "utf8");
    const certificate = fs.readFileSync("/etc/ssl/certs/pocketmoneytgru.pem", "utf8");
    const credentials = { key: privateKey, cert: certificate };

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
    
    httpsServer.listen(PORT, () => {
      console.log(`HTTPS Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

// const { Server } = require("socket.io");
// const httpsServer = https.createServer(credentials, app);
// const io = new Server(httpsServer);

// io.on("connection", (socket) => {
//   socket.on("addMessage", (data) => {
//     io.emit("addMessage", data);
//   });
//   socket.on("chatCreated", (data) => {
//     io.emit("chatCreated", data);
//   });
// });

start();
