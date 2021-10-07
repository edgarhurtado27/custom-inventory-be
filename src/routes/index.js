const express = require('express');

const router = express.Router();
const Controllers = require('../controllers');

router.get('/products', Controllers.getProductsController);

module.exports = router;
