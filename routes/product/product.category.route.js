const express = require("express");
const router = express.Router();

const productCategoryController = require("../../controllers/product/product.category.controller");
const { isAdmin } = require("../../middleware/auth");

router.get("/", productCategoryController.getAllData);
router.get("/:id", productCategoryController.getDatabyID);
router.put("/:id",isAdmin, productCategoryController.updateData);
router.delete("/:id",isAdmin, productCategoryController.deleteData);
router.post("/",isAdmin, productCategoryController.addData);

module.exports = router;