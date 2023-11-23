const express = require("express");
const router = express.Router();
const courierController = require("../../controllers/courier/courier.controller");
const { isAdmin } = require("../../middleware/auth");

router.get("/", courierController.getAllData);
router.get("/:id", courierController.getDatabyID);
router.put("/:id", isAdmin, courierController.updateData);
router.delete("/:id", isAdmin, courierController.deleteData);
router.post("/", isAdmin, courierController.addData);

module.exports = router;
