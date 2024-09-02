const User = require('../../models/user.model');
const ForgotPassword = require('../../models/forgot-password.model');
const generateHelper = require('../../helpers/generate.helper');
const sendMailHelper = require('../../helpers/sendMail.helper');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

// [GET] /user/register
module.exports.register = (req, res) => {
    res.render('client/pages/users/register', {
        pageTitle : 'ĐĂNG KÍ TÀI KHOẢN'
    })
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    req.body.password = md5(req.body.password);
    req.body.cartId = req.cookies.cartId;
    req.body.role = 'client';
    const newUser = new User(req.body);
    await newUser.save();

    await User.updateOne({
        _id : newUser.id,
    }, {
        roomChatId : newUser.id,
    })
    const tokenUser = jwt.sign({id : newUser._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3*60*60*24*1000 });
    res.cookie('tokenUser',tokenUser);
    req.flash('success', 'đăng ký tài khoản thành công');
    res.redirect('/');
}

// [GET] /user/login
module.exports.login = (req, res) => {
    res.render('client/pages/users/login', {
        pageTitle : 'ĐĂNG NHẬP'
    })
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const {email, password} = req.body;
    const accUser = await User.findOne({
        email : email,
        password : md5(password),
        deleted : false,
    })
    if(!accUser){
        req.flash('error', 'sai mật khẩu hoặc email');
        res.redirect('back');
        return;
    }
    const tokenUser = jwt.sign({id : accUser._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3*60*60*24*1000 }); // 3d
    res.cookie('tokenUser', tokenUser);
    req.flash('success', 'đăng nhập thành công');
    res.redirect('/');
}

// [GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie('tokenUser');
    res.redirect('/user/login');
}

// [GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
    res.render('client/pages/users/forgot-password', {
        pageTitle : 'Nhập mail đăng ký tài khoản',
    })
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const emailUser = req.body.email;
    const acc = await User.findOne({
        email : emailUser,
    });

    if(acc){
        const OTP = generateHelper.OTP(4);  // độ dài mã OTP
        sendMailHelper.sendMail(emailUser, 'mã otp khôi phục mật khẩu.', `mã OTP của bạn là ${OTP}`);
        const newAcc = new ForgotPassword({
            email : emailUser,
            OTP : OTP,
        });
        await newAcc.save();
        res.redirect(`/user/password/otp?email=${emailUser}`);
        return;
    } else {
        req.flash('error', 'email chưa đăng kí tài khoản');
        res.redirect('back');
        return;
    }
}

// [GET] /user/password/otp
module.exports.otpPassword = (req, res) => {
    const email = req.query.email;
    res.render('client/pages/users/otp-password', {
        pageTitle : 'Xác thực OTP',
        email : email,
    })
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const {email, otp} = req.body;
    const accForgotPassword = await ForgotPassword.findOne({
        email : email,
        OTP : otp,
    });
    if(!accForgotPassword){
        req.flash("error", "OTP không hợp lệ!");
        res.redirect("back");
        return;
    }
    const user = await User.findOne({
        email: email,
    })

    const tokenUser = jwt.sign({id : user._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3*60*60*24*1000 });
    res.cookie('tokenUser',tokenUser);

    res.redirect('/user/password/reset');
}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/users/reset-password", {
      pageTitle: "Đổi mật khẩu mới"
    });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const newPassword = req.body.password;
    const tokenUser = jwt.verify(req.cookies.tokenUser, process.env.ACCESS_TOKEN_SECRET);
    const idUser = tokenUser.id;
    const acc = await User.updateOne({
        _id : idUser,
    }, {
        password : md5(newPassword),
    })
    res.redirect('/')
}

// [GET] /user/auth/google/callback
module.exports.authGoogle = async (req, res) => {
    const profileJson = req.user._json;
    console.log(profileJson)
    const acc = await User.findOne({
        email : profileJson.email,
    });
    const googleAcc = {
        fullName : profileJson.name,
        avatar : profileJson.picture,
        email : profileJson.email,
        googleId : profileJson.sub,
    };
    if(acc){
        googleAcc.password = acc.password;
        await User.updateOne({
            email : profileJson.email,
        }, googleAcc);
        const tokenUser = jwt.sign({id : acc._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3*60*60*24*1000 }); // 3d
        res.cookie('tokenUser', tokenUser);
    } else {
        googleAcc.cartId = req.cookies.cartId;
        const newAcc = new User(googleAcc);
        await newAcc.save();
        const tokenUser = jwt.sign({id : newAcc._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3*60*60*24*1000 }); // 3d
        res.cookie('tokenUser', tokenUser);
    }
    
    res.redirect('/');
}