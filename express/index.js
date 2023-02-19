const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const config = require("config");
const PORT = process.env.PORT || config.get("PORT");

const authRouter = require("./sections/auth/authRouter");
const chatRouter = require("./sections/chat/chatRouter");

const app = express();

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

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
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

io.on("connection", (socked) => {
  socked.on("addMessage", (data) => {
    io.emit("addMessage", data);
  });
  socked.on("chatCreated", (data) => {
    io.emit("chatCreated", data);
  });
});

start();
httpServer.listen(config.get("WS_PORT"));
