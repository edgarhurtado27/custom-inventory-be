const express = require('express');

const router = express.Router();
const Controllers = require('../controllers');

router.get('/products', Controllers.getProductsController);

router.post('/products', Controllers.addProductsController);

router.delete('/products', Controllers.deleteProdutsController);

router.post('/items', Controllers.addItemsController);

router.get('/items', Controllers.getItemsController);

module.exports = router;
