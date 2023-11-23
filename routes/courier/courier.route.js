const express = require("express");
const router = express.Router();
const courierController = require("../../controllers/courier/courier.controller");

router.get("/", courierController.getAllData);
router.get("/:id", courierController.getDatabyID);
router.put("/:id", courierController.updateData);
router.delete("/:id", courierController.deleteData);
router.post("/", courierController.addData);

module.exports = router;