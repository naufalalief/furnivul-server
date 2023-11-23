const express = require('express');
const router = express.Router();

const reviewController = require('../../controllers/review/review.controller.js');

router.get('/', reviewController.getAllData);
router.get('/:id', reviewController.getDatabyID);
router.put('/:id', reviewController.updateData);
router.delete('/:id', reviewController.deleteData);
router.post('/', reviewController.addData);

module.exports = router;