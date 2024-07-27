const express = require('express');
const router = express.Router();

const controller = require('../../controller/client/address.controller');

const addressValidate = require('../../validates/client/address.validate');

router.get('/', controller.index);

router.get('/create', controller.create);
router.post('/create',addressValidate.checkAddress, controller.createPost);
router.patch('/default', controller.addressDefault);
module.exports = router;