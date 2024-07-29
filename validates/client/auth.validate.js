const User = require('../../models/user.model');

module.exports.register = async (req, res, next) => {
    const {fullName, email, password} = req.body;
    if(!(fullName && email && password)){
        req.flash('error', 'vui lòng nhập đủ các trường thông tin');
        res.redirect('back');
        return;
    }
    const accUser = await User.findOne({
        email : email,
        deleted : false,
    });
    if(!accUser){
        if(password.length < 8){
            req.flash('error', 'mật khẩu không đủ 8 kí tự');
            res.redirect('back');
            return;
        }
        next();
        return;
    }

    if(email === accUser.email){
        req.flash('error', 'email này đã tồn tại trong hệ thống');
        res.redirect('back');
        return;
    }
}