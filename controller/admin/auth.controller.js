const Accounts = require('../../models/account.model');
const md5 = require('md5');
require('dotenv').config();
const systemConfig = require('../../config/system');
const jwt = require('jsonwebtoken')
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
        password : password,
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
    if(password != account.password) {
        // sai pass => tăng countLogin
        await Accounts.updateOne({
            email : email,
            deleted : false,
        }, {
            countLogin : account.countLogin + 1
        });
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

    const generateTokens = payload => {
        const id = payload;
        // Create JWT
        const accessToken = jwt.sign(  
            {id},
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '3d'
            }
        )
    
        // const refreshToken = jwt.sign(    // LÀM MỚI TOKEN - CHƯA CÓ Ý TƯỞNG LÀM
        //     {id},
        //     process.env.REFRESH_TOKEN_SECRET,
        //     {
        //         expiresIn: '1h'
        //     }
        // )
    
        return { accessToken}
    }
    const token = generateTokens(account._id);
    
    res.cookie("accessToken", token.accessToken, { expires: new Date(Date.now() + 3*60*60*24*1000)});
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}

// [GET]  admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie('accessToken');
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}