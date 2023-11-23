const express = require("express");
const router = express.Router();

const productTypeController = require("../../controllers/product/product.type.controller");

router.get("/", productTypeController.getAllData);
router.get("/:id", productTypeController.getDatabyID);
router.put("/:id", productTypeController.updateData);
router.delete("/:id", productTypeController.deleteData);
router.post("/", productTypeController.addData);

module.exports = router;