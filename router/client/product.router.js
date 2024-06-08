const express = require('express');

const router = express.Router();

const controller = require('../../controller/client/product.controller');
router.get('/admin', controller.index);

module.exports = router;