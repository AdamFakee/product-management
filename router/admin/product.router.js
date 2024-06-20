const constroller = require('../../controller/admin/product.controller');
const express = require("express");
const router = express.Router();
router.get('/', constroller.index);
router.patch('/change-status/:statusChange/:id', constroller.changeStatus);
router.patch('/change-multi-status', constroller.changeMultiStatus);
module.exports = router;