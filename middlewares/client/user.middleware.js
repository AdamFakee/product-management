const User = require("../../models/user.model");
const jwt = require('jsonwebtoken');

module.exports.infoUser = async (req, res, next) => {
    try {
        if(req.cookies.accessToken) {
            const accessToken = req.cookies.accessToken;
            const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findOne({
                _id : payload.id,
                deleted: false
            });
            res.locals.cartId = payload.cartId;
            if(user) {
                res.locals.user = user;
            }
        } else {
            res.redirect('/user/login');
            return;
        }
        next();
    } catch (error) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        req.flash('error', 'phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        res.redirect('/user/login');
    }
}

module.exports.checkCustomer = async (req, res, next) => {
    try {
        if(req.cookies.accessToken) {
            const accessToken = req.cookies.accessToken;
            const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findOne({
                _id : payload.id,
                deleted: false
            });
            res.locals.cartId = payload.cartId;
            if(user) {
                res.locals.user = user;
            }
        }
        next();
    } catch (error) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        req.flash('error', 'phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        res.redirect('/user/login');
    }
}