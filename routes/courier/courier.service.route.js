const express = require('express');
const router = express.Router();

const courierServiceController = require('../../controllers/courier/courier.service.controller');

router.get('/', courierServiceController.getAllData);
router.get('/:id', courierServiceController.getDatabyID);
router.put('/:id', courierServiceController.updateData);
router.delete('/:id', courierServiceController.deleteData);
router.post('/', courierServiceController.addData);

module.exports = router;