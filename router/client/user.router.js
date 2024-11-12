const express = require('express');
const router = express.Router();
const passport = require('passport');
const authGoogleHelper = require('../../helpers/authGoogle.helper');
const controller = require('../../controller/client/user.controller');
const { limiter } = require('../../helpers/rateLimitTraffic.helper');

router.get('/register', controller.register);

// configure express rate limit
const message = 'too many click', limitHit = 1, windowMs = 60 * 1000; // 5s
router.post('/register', limiter(windowMs, limitHit, message) , controller.registerPost);

router.get('/login', controller.login);
router.post('/login', controller.loginPost);

router.get('/logout', controller.logout);
router.get('/password/forgot', controller.forgotPassword);

router.post('/password/forgot', limiter(windowMs, limitHit, message) , controller.forgotPasswordPost);
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