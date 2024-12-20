const User = require('../../models/user.model');
const ForgotPassword = require('../../models/forgot-password.model');
const Cart = require('../../models/cart.model.js');
const Address = require('../../models/address.model.js');
const generateHelper = require('../../helpers/generate.helper');
const jwtHelper = require('../../helpers/jwt.helper.js');
const sendMailHelper = require('../../helpers/sendMail.helper');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const { addToken_WhenRegister, removeToken_WhenLogout, removeInWhiteListToken } = require('../../helpers/whiteListToken.helper.js');

// [GET] /user/register
module.exports.register = (req, res) => {
    res.render('client/pages/users/register', {
        pageTitle : 'ĐĂNG KÍ TÀI KHOẢN'
    })
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    req.body.password = md5(req.body.password);

    
    req.body.loginWith = ['email'];
    const existAcc = await User.findOne({
        email: req.body.email,
        loginWith : {
            $in : ['email', 'google']
        }
    });
    if(existAcc) {
        if(!existAcc.loginWith.includes('email')) {
            const {accessToken, refreshToken} = generateHelper.jwtToken({id : existAcc._id, cartId : existAcc.cartId}); // generate token
            await User.updateOne({
                _id : existAcc._id
            }, {
                password : req.body.password,
                loginWith : ['email'],
                refreshToken : refreshToken
            });


            // add token to white list
            await addToken_WhenRegister(req, accessToken, refreshToken);


            // assign to cookies
            res.cookie("accessToken", accessToken, { expires: new Date(Date.now() + 7*24*60*60*1000)});
            res.cookie("refreshToken", refreshToken, { expires: new Date(Date.now() + 20*24*60*60*1000)});
            req.flash('success', 'đăng ký tài khoản thành công');
            res.redirect('/');
            return;
        } else {
            req.flash('error', 'email đã tồn tại');
            res.redirect('back');
            return;
        }
    }
    // tạo cart mới cho tài khoản - nếu tài khoản chưa đc tạo lần nào
    const newCart = new Cart();
    await newCart.save();

    // tạo địa chỉ mới cho cartId
    const newAddress = new Address({
        cartId : newCart.id,
    })
    await newAddress.save();

    req.body.cartId = newCart.id;

    const newUser = new User(req.body);
    await newUser.save();

    await jwtHelper.jwtNomal(newUser, User, res, req, {
        roomChatId : newUser.id,
    });
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
    await jwtHelper.jwtNomal(accUser, User, res, req);
    
    req.flash('success', 'đăng nhập thành công');

    res.redirect('/');
}

// [] /user/logout
module.exports.logout = async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // if not exist token
    if(!accessToken || !refreshToken) {
        return res.redirect('back');
    }
    // verify token
    try {
        const AT_payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const RT_payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if(AT_payload.id != RT_payload.id) {
            return res.redirect('back');
        }
        const user = await User.findOne({
            _id : AT_payload.id,
        })

        if(!user) {
            return res.redirect("back");
        }
        
        // remove token in white list
        await removeToken_WhenLogout(AT_payload, RT_payload);


        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('cartId');
        res.redirect('/user/login');
    } catch (error) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('cartId');
        res.redirect('/user/login');
    }
    
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
    await User.updateOne({
        _id : idUser,
    }, {
        password : md5(newPassword),
    })
    res.clearCookie('tokenUser');
    const accUser = await User.findOne({
        _id : idUser
    });
    await jwtHelper.jwtNomal(accUser, User, res, req);


    req.flash('success', 'đăng nhập thành công');
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
        await jwtHelper.jwtNomal(acc, User, res, req);
    } else {
        // tạo cart mới cho tài khoản
        const newCart = new Cart();
        await newCart.save();

        // tạo địa chỉ mới cho cartId
        const newAddress = new Address({
            cartId : newCart.id,
        })
        await newAddress.save();

        googleAcc.cartId = newCart.id;
        googleAcc.loginWith = ['google'];
        const newAcc = new User(googleAcc);
        await newAcc.save();
        await jwtHelper.jwtNomal(newAcc, User, res, req);
    }
    
    res.redirect('/');
}

// [POST] /user/reset-token 
module.exports.resetToken = async (req, res) => {
    const bearer = req.headers.authorization;
    const refreshTokenBear = bearer.split(' ')[1];
    try {
        const payload = jwt.verify(refreshTokenBear, process.env.REFRESH_TOKEN_SECRET);

        // remove token in whitelist
        const RT_keyName = "refreshToken";
        await removeInWhiteListToken(payload, RT_keyName);

        // generate new token
        const accUser = await User.findOne({
            _id : payload.id
        })
        if(!accUser) {
            return res.json({
                code : 401
            })
        }

        await jwtHelper.jwtNomal(accUser, User, res, req);
        res.json({
            code : 200
        })
    } catch (error) {
        console.log(error)
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({
            code : 401
        })
    }
}