const express = require("express");
const router = express.Router();

const productController = require("../../controllers/product/product.controller");

router.get("/", productController.getAllData);
router.get("/:id", productController.getDatabyID);
router.put("/:id", productController.updateData);
router.delete("/:id", productController.deleteData);
router.post("/", productController.addData);

module.exports = router;