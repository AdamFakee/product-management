const express = require('express');
const router = express.Router();

const controller = require('../../controller/client/cart.controller');
const cartValidate = require('../../validates/client/cart.validate');

router.post('/add/:productId', cartValidate.checkQuantity, controller.addPost);

router.get('/', controller.index);

router.patch('/:amount', controller.indexPatch);

router.get('/delete/:productId', controller.delete);

router.get('/update/:productId/:quantity',cartValidate.checkQuantity, controller.update);

module.exports = router;