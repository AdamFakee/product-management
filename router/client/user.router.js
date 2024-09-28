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
router.post('/reset-token', controller.resetToken);

// đăng nhập bằng google auth2

// cấu hình
authGoogleHelper();

// chuyển hướng sang bên link của gg để cho người dùng đăng nhập
router.get('/auth/google',passport.authenticate('google', { scope: ['profile', 'email'] }));

// đăng nhập xong => chuyển hướng về link này 
router.get('/auth/google/callback', 
    passport.authenticate('google', {failureRedirect: '/user/login' }), 
    controller.authGoogle
);
// End đăng nhập bằng google auth2
module.exports = router;