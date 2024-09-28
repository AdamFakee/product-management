const express = require('express');
const router = express.Router();

const controller = require('../../controller/admin/resetToken.controller');

router.post('/', controller.resetToken);

module.exports = router;