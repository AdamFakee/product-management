const constroller = require('../../controller/admin/dashboard.controller');
const express = require("express");
const router = express.Router();
router.get('/', constroller);
module.exports = router;