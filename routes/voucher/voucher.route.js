const express = require("express");
const router = express.Router();

const voucherController = require("../../controllers/voucher/voucher.controller.js");
const { isAdmin } = require("../../middleware/auth.js");

router.get("/", voucherController.getAllData);
router.get("/:id", voucherController.getDatabyID);
router.put("/:id", isAdmin, voucherController.updateData);
router.delete("/:id", isAdmin, voucherController.deleteData);
router.post("/", isAdmin, voucherController.addData);

module.exports = router;
