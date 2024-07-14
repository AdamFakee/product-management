const Accounts = require('../../models/account.model');
const md5 = require('md5');
const systemConfig = require('../../config/system');

// [GET] admin/auth/login
module.exports.login = (req, res) => {
    res.render('admin/pages/auth/login.pug', {
        pageTitle : 'Đăng nhập'
    })
}

// [POST] admin/auth/login
module.exports.loginPost = async (req, res) => {
    const password = md5(req.body.password);
    const email = req.body.email;
    const login = await Accounts.findOne({
        password : password,
        email : email,
        deleted : false,
    });
    if(!login){
        req.flash('error', 'tài khoản hoặc mật khẩu sai');
        res.redirect('back');
        return;
    }
    if(login.status === 'inactive'){
        req.flash('error', 'tài khoản đang bị khóa');
        res.redirect('back');
        return;
    }
    res.cookie("token", Accounts.token);
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}