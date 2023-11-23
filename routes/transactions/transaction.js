const express = require("express");
const router = express.Router();

const transactionController = require("../../controllers/transaction/transaction.controller.js");
const { isAdmin } = require("../../middleware/auth.js");

router.get("/data", isAdmin, transactionController.getAllDataTransaction);
router.get("/", transactionController.getAllData);
router.get("/:id", transactionController.getDatabyID);
router.put("/:id", transactionController.updateData);
router.delete("/:id", isAdmin, transactionController.deleteData);
router.post("/", transactionController.addData);

module.exports = router;
