const express = require('express');
const router = express.Router();
const passport = require('passport');
const authGoogleHelper = require('../../helpers/authGoogle.helper');
const controller = require('../../controller/client/user.controller');
const validate = require('../../validates/client/auth.validate');

router.get('/register', controller.register);
router.post('/register',validate.register, controller.registerPost);

router.get('/login', controller.login);
router.post('/login', controller.loginPost);

router.get('/logout', controller.logout);
router.get('/password/forgot', controller.forgotPassword);
router.post('/password/forgot', controller.forgotPasswordPost);
router.get('/password/otp', controller.otpPassword);
router.post('/password/otp', controller.otpPasswordPost);
router.get("/password/reset", controller.resetPassword);
router.post('/password/reset', controller.resetPasswordPost);

// Định tuyến cho Google Authentication
authGoogleHelper();
router.get('/auth/google',passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), controller.authGoogle);

module.exports = router;