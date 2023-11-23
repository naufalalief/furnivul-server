const express = require("express");
const router = express.Router();

const productCategoryController = require("../../controllers/product/product.category.controller");

router.get("/", productCategoryController.getAllData);
router.get("/:id", productCategoryController.getDatabyID);
router.put("/:id", productCategoryController.updateData);
router.delete("/:id", productCategoryController.deleteData);
router.post("/", productCategoryController.addData);

module.exports = router;