const constroller = require('../../controller/admin/product.controller');
const express = require("express");
const router = express.Router();
router.get('/', constroller);
module.exports = router;