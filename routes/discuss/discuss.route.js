const express = require("express");
const router = express.Router();

const discussController = require("../../controllers/discuss/discuss.controller.js");
const { auth } = require("../../middleware/auth");

router.get("/", discussController.getAllData);
router.get("/:id", auth, discussController.getDatabyID);
router.put("/:id", auth, discussController.updateData);
router.delete("/:id", auth, discussController.deleteData);
router.post("/", auth, discussController.addData);

module.exports = router;
