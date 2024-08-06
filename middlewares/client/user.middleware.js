const User = require("../../models/user.model");
const jwt = require('jsonwebtoken');

module.exports.infoUser = async (req, res, next) => {
    try {
        if(req.cookies.tokenUser) {
            const tokenUser = req.cookies.tokenUser;
            const idAccount = jwt.verify(tokenUser, process.env.ACCESS_TOKEN_SECRET).id;
            const user = await User.findOne({
                _id : idAccount,
                deleted: false
            });
            if(user) {
            res.locals.user = user;
            }
        }
        next();
    } catch (error) {
        req.flash('error', 'phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        res.redirect('/user/login');
    }
}