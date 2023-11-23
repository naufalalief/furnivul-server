const express = require("express");
const router = express.Router({
  mergeParams: true,
});
const replyController = require("../../controllers/discuss/reply.controller");
const { isAdmin } = require("../../middleware/auth");

router.get("/data", isAdmin, replyController.getAllReply);
router.get("/", replyController.getAllData);
router.get("/:id", replyController.getDatabyID);
router.put("/:id", replyController.updateData);
router.delete("/:id", replyController.deleteData);
router.post("/", replyController.addData);

module.exports = router;
