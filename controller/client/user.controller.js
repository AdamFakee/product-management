const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');
// [GET] /user/register
module.exports.register = (req, res) => {
    res.render('client/pages/users/register', {
        pageTitle : 'ĐĂNG KÍ TÀI KHOẢN'
    })
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    req.flash('succes', 'đăng ký tài khoản thành công');
    res.redirect('/');
}

