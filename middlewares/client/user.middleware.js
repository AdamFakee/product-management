const User = require("../../models/user.model");
const jwt = require('jsonwebtoken');

// check các router cần đăng nhập mới đc dùng
module.exports.infoUser = async (req, res, next) => {
    try {
        if(req.cookies.accessToken) {
            const accessToken = req.cookies.accessToken;
            const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const userInCache = myCache.get(`user:${payload.id}`); // lưu thông tin người dùng theo dạng : user:${userId}
            if(userInCache != null) { // tồn tại người dùng trong cache
                res.locals.cartId = payload.cartId;
                res.locals.user = userInCache;
                next();
                return;
            }
            const user = await User.findOne({
                _id : payload.id,
                deleted: false
            });
            res.locals.cartId = payload.cartId;
            if(user) {
                myCache.set(`user:${payload.id}`, user, 3600);
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

// check tài khoản chưa login
module.exports.checkCustomer = async (req, res, next) => {
    try {
        if(req.cookies.accessToken) {
            const accessToken = req.cookies.accessToken;
            const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const userInCache = myCache.get(`user:${payload.id}`); // lưu thông tin người dùng theo dạng : user:${userId}
            if(userInCache!=null) { // tồn tại người dùng trong cache
                res.locals.cartId = payload.cartId;
                res.locals.user = userInCache;
                next();
                return;
            }
            const user = await User.findOne({
                _id : payload.id,
                deleted: false
            });
            res.locals.cartId = payload.cartId;
            if(user) {
                myCache.set(`user:${payload.id}`, user, 3600);
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