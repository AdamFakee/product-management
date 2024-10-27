const express = require('express');
const router = express.Router();

const controller = require('../../controller/client/checkout.controller');
const cartMiddleware = require('../../middlewares/client/cart.middleware');
const checkoutValidate = require('../../validates/client/checkout.validate');
const { limiter } = require('../../helpers/rateLimitTraffic.helper');

router.get('/',cartMiddleware.checkout, controller.index);

// configure express rate limit
const message = 'too many order make systerm overload', limitHit = 3, windowMs = 60 * 1000; // 5s
router.post('/order', limiter(windowMs, limitHit, message) ,checkoutValidate.checkAddress, controller.orderPost);
router.get("/success/:orderId", controller.success);
module.exports = router;