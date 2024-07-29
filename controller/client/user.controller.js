const User = require('../../models/user.model');
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
    const newUser = new User(req.body);
    await newUser.save();
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


