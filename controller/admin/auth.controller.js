const Accounts = require('../../models/account.model');
const md5 = require('md5');
const systemConfig = require('../../config/system');
const generateHelper = require('../../helpers/generate.helper');
const { addToken_WhenRegister, removeToken_WhenLogout } = require('../../helpers/whiteListToken.helper');
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
    const {accessToken, refreshToken} = generateHelper.jwtToken({id : account._id}); // generate token

    // add token to white list 
    await addToken_WhenRegister(req, accessToken, refreshToken);

    await Accounts.updateOne({
        _id : account._id
    }, {
        refreshToken : refreshToken
    })
    res.cookie("accessToken", accessToken, { expires: new Date(Date.now() + 3*24*60*60*1000)}); // 3d
    res.cookie("refreshToken", refreshToken, { expires: new Date(Date.now() + 3*24*60*60*1000)});
    
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}

// [GET]  admin/auth/logout
module.exports.logout = async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    // if not exist token
    if(!accessToken || !refreshToken) {
        return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }
    // verify token
    try {
        const AT_payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const RT_payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if(AT_payload.id != RT_payload.id) {
            return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        }
        const user = await Accounts.findOne({
            _id : AT_payload.id,
        })

        if(!user) {
            return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        }
        
        // remove token in white list
        await removeToken_WhenLogout(AT_payload, RT_payload);


        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('cartId');
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    } catch (error) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('cartId');
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);    }
    
}