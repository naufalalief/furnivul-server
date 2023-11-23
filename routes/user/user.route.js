const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/user.controller");

router.get("/", userController.getAllData);
router.get("/:id", userController.getDatabyID);
router.put("/", userController.updateData);
router.delete("/:id", userController.deleteData);

module.exports = router;