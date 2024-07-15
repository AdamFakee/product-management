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
    const account = await Accounts.findOne({
        email : email,
        deleted : false,
    });
    if(!account) {
        req.flash("error", "Email không tồn tại trong hệ thống!");
        res.redirect("back");
        return;
    }

    // đăng nhập quá 5 lần => bị khóa acc tạm thời
    if(account.countLogin >= 5){
        await Accounts.updateOne({
            email : email,
            deleted : false,
        }, {
            status : false,
        });
        req.flash("error", "Tài khoản đã bị khóa!");
        res.redirect("back");
        return;
    }
    if(md5(password) != account.password) {
        // sai pass => tăng countLogin
        await Accounts.updateOne({
            email : email,
            deleted : false,
        }, {
            countLogin : account.countLogin + 1
        });
        console.log(account.countLogin)
        req.flash("error", `Sai mật khẩu! Còn ${5 - account.countLogin} lần nhập`);
        res.redirect("back");
        return;
    }
    // đúng tài khoản => reset countLogin
    await Accounts.updateOne({
        email : email,
        deleted : false,
    }, {
        countLogin : 0,
    });

    if(account.status != "active") {
        req.flash("error", "Tài khoản đang bị khóa!");
        res.redirect("back");
        return;
    }
    res.cookie("token", account.token);
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}

// [GET]  admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}