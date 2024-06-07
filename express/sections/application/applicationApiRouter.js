const Router = require("express");
const router = new Router();
const controller = require("./applicationApiController");
const authMiddleware = require("../../middlewaree/authMiddleware");
const monitorSuspiciousActivity = require("../../middlewaree/monitorSuspiciousActivity");

router.post("/createApplication", authMiddleware, controller.createApplication);
router.get("/getMyApplications", authMiddleware, controller.getMyApplications);
router.post(
  "/completeApplication",
  authMiddleware,
  monitorSuspiciousActivity,
  controller.completeApplication
);
router.post("/acceptApplication", authMiddleware, controller.acceptApplication);
router.post("/deliteApplication", authMiddleware, controller.deliteApplication);
router.get(
  "/getCommentsByUserId",
  authMiddleware,
  controller.getCommentsByUserId
);
router.get("/getMyComments", authMiddleware, controller.getMyComments);

module.exports = router;
