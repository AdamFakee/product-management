const constroller = require('../../controller/admin/product.controller');
const express = require("express");
const router = express.Router();
router.get('/', constroller.index);
router.patch('/change-status/:statusChange/:id', constroller.changeStatus);
module.exports = router;