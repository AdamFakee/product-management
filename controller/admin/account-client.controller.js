const User = require('../../models/user.model');
const md5 = require('md5');

// [GET] /admin/account-clients
module.exports.index = async (req, res) => {
    const accounts = await User.find({
        role: { $exists: true }
    });
    res.render('admin/pages/account-clients/index', {
        accounts : accounts,
    })
}

// [GET] /admin/account-clients/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/account-clients/create');
}

// [POST] /admin/account-clients/create
module.exports.createPost = async (req, res) => {
    req.body.password = md5(req.body.password);
    req.body.role = 'admin';
    const checkUser = await User.findOne({
        email : req.body.email,
    });
    if(checkUser){
        req.flash('error', 'email đã tồn tại');
        res.redirect('back');
        return;
    }
    const newClientAdmin = new User(req.body);
    await newClientAdmin.save();
    req.flash('success', 'tạo tài khoản thành công'); 
    res.redirect('back');
}

// [GET] /admin/account-clients/edit
module.exports.edit = async (req, res) => {
    try {
        const idUser = req.params.id;
        const user = await User.findOne({
            _id : idUser
        })

        res.render('admin/pages/account-clients/edit', {
            user : user,
        });
    } catch (error) {
        console.log(error);
        req.flash('error', 'đừng sửa link lung tung');
        res.redirect('back');
    }
}

// [PATCH] /admin/account-clients/edit
module.exports.editPatch = async (req, res) => {
    try {
        const idUser = req.params.id;
        const user = await User.findOne({
            _id : idUser
        })

        await User.updateOne({
            _id : idUser,
            status : 'active',
            deleted : false,
        },req.body)

        req.flash('success', 'cập nhật thành công');
        res.redirect('back');
    } catch (error) {
        console.log(error);
        req.flash('error', 'đừng sửa link lung tung');
        res.redirect('back');
    }
}