const express = require('express');
const router = express.Router();
const cartMiddleware = require('../../middlewares/client/cart.middleware');
const categoryMiddleware = require('../../middlewares/client/category.middleware');
const controller = require('../../controller/client/home.controller');
const userMiddleware = require('../../middlewares/client/user.middleware');


router.get('/' ,userMiddleware.checkCustomer , cartMiddleware.cartId, categoryMiddleware, controller.index);
module.exports = router;