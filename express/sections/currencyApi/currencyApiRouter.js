const Router = require("express");
const router = new Router();
const controller = require("./currencyApiController");
const authMiddleware = require("../../middlewaree/authMiddleware");

router.get("/getPrice", authMiddleware, controller.getPrice);
router.get("/getPriceFiat", authMiddleware, controller.getPriceFiat);
router.get("/getCurrencies", authMiddleware, controller.getCurrencies);
router.get("/getCripto", authMiddleware, controller.getCripto);
router.post("/setCurrencies", authMiddleware, controller.setCurrencies);

module.exports = router;
