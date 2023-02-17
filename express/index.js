const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 3000;

const authRouter = require("./sections/auth/authRouter");
const chatRouter = require("./sections/chat/chatRouter");

const app = express();

// const http = require("http").createServer(app);
// const io = require("socket.io")(http);
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
    await mongoose.connect(
      `mongodb+srv://admin:***REMOVED***@cluster0.rx50cdv.mongodb.net/test?retryWrites=true&w=majority`
    );
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
httpServer.listen(3002);
