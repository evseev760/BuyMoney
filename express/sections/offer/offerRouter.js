const Router = require("express");
const router = new Router();
const controller = require("./offerController");
const authMiddleware = require("../../middlewaree/authMiddleware");

router.post("/createOffer", authMiddleware, controller.createOffer);
router.post("/editOffer", authMiddleware, controller.editOffer);
router.get("/getOffers", authMiddleware, controller.getOffers);
router.get("/getMyOffers", authMiddleware, controller.getMyOffers);
router.get("/getOffer/:offerId", authMiddleware, controller.getOffer);
router.post("/deliteOffer", authMiddleware, controller.deliteOffer);

module.exports = router;
