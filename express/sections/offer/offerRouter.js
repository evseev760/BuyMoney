const Router = require("express");
const router = new Router();
const controller = require("./offerController");
const authMiddleware = require("../../middlewaree/authMiddleware");

router.post("/createOffer", authMiddleware, controller.createOffer);
router.get("/getOffers", authMiddleware, controller.getOffers);
router.get("/getOffer/:offerId", authMiddleware, controller.getOffer);
router.get("/getPrice", authMiddleware, controller.getPrice);
// router.get("/getProposals/:offerId", authMiddleware, controller.getProposals);
// router.post("/addProposal", authMiddleware, controller.addProposal);

module.exports = router;
