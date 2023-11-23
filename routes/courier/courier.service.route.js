const express = require("express");
const router = express.Router();

const courierServiceController = require("../../controllers/courier/courier.service.controller");
const { isAdmin } = require("../../middleware/auth");

router.get("/", courierServiceController.getAllData);
router.get("/:id", courierServiceController.getDatabyID);
router.put("/:id", isAdmin, courierServiceController.updateData);
router.delete("/:id", isAdmin, courierServiceController.deleteData);
router.post("/", isAdmin, courierServiceController.addData);

module.exports = router;
