const Router = require("express");
const router = new Router();
const controller = require("./verificationController");
const authMiddleware = require("../../middlewaree/authMiddleware");

router.post("/generatePayload", controller.generatePayload);
router.post("/checkProof", controller.checkProof);
router.post("/authWallet", authMiddleware, controller.walletAuth);

module.exports = router;
