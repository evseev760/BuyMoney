const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    let walletToken = null;

    if (!token) {
      return res.status(403).json({ message: "Пользователь не авторизован" });
    }
    if (req.headers.wallettoken) {
      walletToken = jwt.verify(
        req.headers.wallettoken,
        config.get("walletSecret")
      );
    }
    const decodedData = jwt.verify(token, config.get("secretKey"));
    req.user = decodedData;
    req.wallet = walletToken;
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: "Пользователь не авторизован" });
  }
};
