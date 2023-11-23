const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/user.controller");
const { isAdmin } = require("../../middleware/auth");

router.get("/", isAdmin, userController.getAllData);
router.get("/:id", isAdmin, userController.getDatabyID);
router.put("/", userController.updateData);
router.delete("/:id", isAdmin, userController.deleteData);

module.exports = router;