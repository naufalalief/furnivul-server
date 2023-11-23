const express = require("express");
const router = express.Router();

const productTypeController = require("../../controllers/product/product.type.controller");
const { isAdmin } = require("../../middleware/auth");

router.get("/", productTypeController.getAllData);
router.get("/:id", productTypeController.getDatabyID);
router.put("/:id", isAdmin, productTypeController.updateData);
router.delete("/:id", isAdmin, productTypeController.deleteData);
router.post("/", isAdmin, productTypeController.addData);

module.exports = router;
