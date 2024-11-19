const systemConfig = require('../../config/system');
const Accounts = require('../../models/account.model');
const Roles = require('../../models/role.model');
const jwt = require('jsonwebtoken');
const { checkExistInWhiteListToken } = require("../../helpers/whiteListToken.helper");

module.exports.requireAuth = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    } 
    try {
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        // check accessToken in whitelist
        const AT_keyName = "accessToken";
        const tokenInWhiteList = await checkExistInWhiteListToken(payload, AT_keyName, accessToken, req);
        // if not exist token in white list
        if(!tokenInWhiteList) {
            return res.redirect(`/${systemConfig.prefixAdmin}/auth/logout`);
        }

        const account = await Accounts.findOne({
            _id : payload.id,
            deleted : false,
        });

        if(!account){
            res.redirect(`/${systemConfig.prefixAdmin}/auth/logout`);
            return;
        };
        // lấy quyền được cấp cho tài khoản 
        const role = await Roles.findOne({
            _id : account.role_id
        }).select('permissions');
        res.locals.role = role;  // gán vào biến để truy vấn - tính năng phân quyền
        // end lấy quyền được cấp cho tài khoản 
        res.locals.account = account;  // tài khoản đăng nhập vào web
        next();
    } catch (error) {
        console.log(error)
        req.flash('error', 'phiên đăng nhập đã hết hạn - vui lòng đăng nhập lại');
        res.redirect(`/${systemConfig.prefixAdmin}/auth/logout`);
    }
}