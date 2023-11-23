const express = require('express');
const router = express.Router();

const transactionDetailController = require('../../controllers/transaction/transaction.detail.controller.js');

router.get('/', transactionDetailController.getAllData);
router.get('/:id', transactionDetailController.getDatabyID);
router.put('/:id', transactionDetailController.updateData);
router.delete('/:id', transactionDetailController.deleteData);
router.post('/', transactionDetailController.addData);

module.exports = router;