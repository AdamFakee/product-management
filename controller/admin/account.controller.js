const Accounts = require('../../models/account.model');
const Roles = require('../../models/role.model');
const generateHelper = require('../../helpers/generate.helper');
const md5 = require('md5');



// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const accounts = await Accounts.find({
        deleted : false,
    });
    for(const acc of accounts){
        const role_id = acc.role_id;
        const role = await Roles.findOne({
            _id : role_id,
            deleted : false,
        });
        acc.roleTitle = role.title;
    }
    res.render("admin/pages/accounts/index", {
      pageTitle: "Tài khoản admin",
      accounts : accounts
    });
}

// [GET] admin/accounts/create 
module.exports.create = async (req, res) => {
    const roles = await Roles.find({}).select('title');
    res.render('admin/pages/accounts/create.pug', {
        pageTitle : 'Thêm mới tài khoản',
        roles : roles
    });
}

// [POST] admin/accounts/create
module.exports.createPost = async ( req, res) => {
    req.body.countLogin = 0;
    req.body.password = md5(req.body.password);
    req.body.token = generateHelper.generateRandomString(30);
    const newAccount = new Accounts(req.body);
    await newAccount.save();
    req.flash('success', 'tạo tài khoản thành công');
    res.redirect('back')
}

// [GET] admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const account = await Accounts.findOne({
        _id : req.params.id,
        deleted : false
    });
    const roles = await Roles.find({
        deleted : false,
    }).select('title');
    res.render('admin/pages/accounts/edit.pug', {
        pageTitle : 'Chỉnh sửa tài khoản',
        account : account,
        roles : roles
    });
}

// [PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    if(req.body.password == "") {
        delete req.body.password;
    } else {
        req.body.password = md5(req.body.password);
    }

    await Accounts.updateOne({
        _id: id,
        deleted: false
    }, req.body);

    req.flash("success", "Cập nhật thành công!");

    res.redirect("back");
}