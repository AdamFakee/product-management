const systemConfig = require('../../config/system');
const Accounts = require('../../models/account.model');
const Roles = require('../../models/role.model');
module.exports.requireAuth = async (req, res, next) => {
    if(!req.cookies.token){
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    } 

    const account = await Accounts.findOne({
        token : req.cookies.token,
        deleted : false,
    });

    if(!account){
        res.redirect(`/${systemConfig}/auth/login`);
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
}