const express = require("express");
const router = express.Router();

const discussController = require("../../controllers/discuss/discuss.controller.js");

router.get("/", discussController.getAllData);
router.get("/:id", discussController.getDatabyID);
router.put("/:id", discussController.updateData);
router.delete("/:id", discussController.deleteData);
router.post("/", discussController.addData);

module.exports = router;