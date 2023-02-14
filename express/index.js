const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("config");
const authRouter = require("./authRouter");
const path = require("path");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://admin:admin123@cluster0.rx50cdv.mongodb.net/test?retryWrites=true&w=majority`
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

start();
