const Router = require("express");
const router = new Router();
const controller = require("./chatController");
const authMiddleware = require("../../middlewaree/authMiddleware");

router.post("/createChat", authMiddleware, controller.createChat);
router.get("/getChats", authMiddleware, controller.getChats);
router.get("/getChat/:chatId", authMiddleware, controller.getChat);
router.get("/getMessages/:chatId", authMiddleware, controller.getMessages);
router.post("/addMessage", authMiddleware, controller.addMessage);

module.exports = router;
