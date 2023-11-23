const express = require("express");
const router = express.Router();

const productController = require("../../controllers/product/product.controller");
const { auth, isAdmin } = require("../../middleware/auth");

router.get("/", productController.getAllData);
router.get("/:id", productController.getDatabyID);
router.put("/:id", auth, isAdmin, productController.updateData);
router.delete("/:id", auth, isAdmin, productController.deleteData);
router.post("/", auth, isAdmin, productController.addData);

module.exports = router;