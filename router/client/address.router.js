const express = require('express');
const router = express.Router();

const controller = require('../../controller/client/address.controller');

router.get('/', controller.index);

router.get('/create', controller.create);
router.post('/create', controller.createPost);
router.patch('/default', controller.addressDefault);
module.exports = router;