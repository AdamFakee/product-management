const express = require('express');
const router = express.Router();

const controller = require('../../controller/client/checkout.controller');
const cartMiddleware = require('../../middlewares/client/cart.middleware');
const checkoutValidate = require('../../validates/client/checkout.validate');

router.get('/',cartMiddleware.checkout, controller.index);
router.post('/order',checkoutValidate.checkAddress, controller.orderPost);
router.get("/success/:orderId", controller.success);
module.exports = router;