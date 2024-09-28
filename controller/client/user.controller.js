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
    req.body.loginWith = ['email'];
    const existAcc = await User.findOne({
        email: req.body.email,
        loginWith : {
            $in : ['email', 'google']
        }
    });
    if(existAcc) {
        if(!existAcc.loginWith.includes('email')) {
            const {accessToken, refreshToken} = generateHelper.jwtToken({id : existAcc._id}); // generate token
            await User.updateOne({
                _id : existAcc._id
            }, {
                password : req.body.password,
                loginWith : ['email'],
                refreshToken : refreshToken
            })
            res.cookie("accessToken", accessToken, { expires: new Date(Date.now() + 300*1000)});
            res.cookie("refreshToken", refreshToken, { expires: new Date(Date.now() + 20*24*60*60*1000)});
            res.cookie('cartId', existAcc.cartId);
            req.flash('success', 'đăng ký tài khoản thành công');
            res.redirect('/');
            return;
        } else {
            req.flash('error', 'email đã tồn tại');
            res.redirect('back');
            return;
        }
    }
    
    const newUser = new User(req.body);
    await newUser.save();

    await User.updateOne({
        _id : newUser.id,
    }, {
        roomChatId : newUser.id,
    })
    const {accessToken, refreshToken} = generateHelper.jwtToken({id : newUser._id}); // generate token
    await User.updateOne({
        _id : newUser._id
    }, {
        refreshToken : refreshToken
    })
    res.cookie("accessToken", accessToken, { expires: new Date(Date.now() + 300*1000)});
    res.cookie("refreshToken", refreshToken, { expires: new Date(Date.now() + 20*24*60*60*1000)});
    res.cookie('cartId', newUser.cartId);
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
    const {accessToken, refreshToken} = generateHelper.jwtToken({id : accUser._id}); // generate token
    await User.updateOne({
        _id : accUser._id
    }, {
        refreshToken : refreshToken
    })
    res.cookie("accessToken", accessToken, { expires: new Date(Date.now() + 300*1000)});
    res.cookie("refreshToken", refreshToken, { expires: new Date(Date.now() + 20*24*60*60*1000)});
    req.flash('success', 'đăng nhập thành công');
    res.redirect('/');
}

// [GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('cartId');
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
            expireAt: Date.now() + 3*60*1000 // 3 minutes
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
    const acc = await User.findOne({
        email : profileJson.email,
        loginWith : {
            $in : ['email', 'google']
        },
    });
    const googleAcc = {
        fullName : profileJson.name,
        avatar : profileJson.picture,
        email : profileJson.email,
    };
    if(acc){
        if(!acc.loginWith.includes('google')){
            await User.updateOne({
                email : profileJson.email,
            }, {
                $push : {
                    loginWith : 'google'
                }
            });
        }
        const {accessToken, refreshToken} = generateHelper.jwtToken({id : acc._id}); // generate token
        await User.updateOne({
            _id : acc._id
        }, {
            refreshToken : refreshToken
        })
        res.cookie("accessToken", accessToken, { expires: new Date(Date.now() + 300*1000)});
        res.cookie("refreshToken", refreshToken, { expires: new Date(Date.now() + 20*24*60*60*1000)});
        res.cookie('cartId', acc.cartId)
    } else {
        googleAcc.cartId = req.cookies.cartId;
        googleAcc.loginWith = ['google'];
        const newAcc = new User(googleAcc);
        await newAcc.save();
        const {accessToken, refreshToken} = generateHelper.jwtToken({id : newAcc._id}); // generate token
        await User.updateOne({
            _id : newAcc._id
        }, {
            refreshToken : refreshToken
        })
        res.cookie("accessToken", accessToken, { expires: new Date(Date.now() + 300*1000)});
        res.cookie("refreshToken", refreshToken, { expires: new Date(Date.now() + 20*24*60*60*1000)});
        res.cookie('cartId', newAcc.cartId);
    }
    
    res.redirect('/');
}

// [POST] /user/reset-token 
module.exports.resetToken = async (req, res) => {
    const bearer = req.headers.authorization;
    const refreshTokenBear = bearer.split(' ')[1];
    console.log(refreshTokenBear)
    try {
        const payload = jwt.verify(refreshTokenBear, process.env.REFRESH_TOKEN_SECRET);
        const {accessToken, refreshToken} = generateHelper.jwtToken({id : payload.id});
        await User.updateOne({
            _id : payload.id,
            refreshToken : refreshTokenBear
        }, {
            refreshToken : refreshToken
        })
        res.cookie("accessToken", accessToken, { expires: new Date(Date.now() + 30*60*1000)}); // 30m
        res.cookie("refreshToken", refreshToken, { expires: new Date(Date.now() + 3*24*60*60*1000)});  // 3d
        res.json({
            code : 200
        })
    } catch (error) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({
            code : 401
        })
    }
}