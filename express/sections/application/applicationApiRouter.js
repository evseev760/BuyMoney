const Router = require("express");
const router = new Router();
const controller = require("./applicationApiController");
const authMiddleware = require("../../middlewaree/authMiddleware");

router.post("/createApplication", authMiddleware, controller.createApplication);
router.get("/getMyApplications", authMiddleware, controller.getMyApplications);

module.exports = router;
