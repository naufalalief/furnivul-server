const express = require('express');
const router = express.Router();

const transactionController = require('../../controllers/transaction/transaction.controller.js');

router.get('/', transactionController.getAllData);
router.get('/:id', transactionController.getDatabyID);
router.put('/:id', transactionController.updateData);
router.delete('/:id', transactionController.deleteData);
router.post('/', transactionController.addData);

module.exports = router;