const express = require('express');
const router = express.Router();

const controller = require('../../controller/client/user.controller');
const validate = require('../../validates/client/auth.validate');

router.get('/register', controller.register);
router.post('/register',validate.register, controller.registerPost);

module.exports = router;