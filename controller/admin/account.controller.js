const Accounts = require('../../models/account.model');
const Roles = require('../../models/role.model');
const generateHelper = require('../../helpers/generate.helper');
const md5 = require('md5');
const { model } = require('mongoose');



// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    if(res.locals.role.permissions.includes('account_view')){
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
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [GET] admin/accounts/create 
module.exports.create = async (req, res) => {
    if(res.locals.role.permissions.includes('account_create')){
        const roles = await Roles.find({
            deleted : false,
        }).select('title');
        res.render('admin/pages/accounts/create.pug', {
            pageTitle : 'Thêm mới tài khoản',
            roles : roles
        });
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [POST] admin/accounts/create
module.exports.createPost = async ( req, res) => {
    if(res.locals.role.permissions.includes('account_create')){
        req.body.countLogin = 0;
        req.body.password = md5(req.body.password);
        req.body.token = generateHelper.generateRandomString(30);
        req.body.createdBy = res.locals.account.id; // cập nhật tài khoản tạo acc
        const newAccount = new Accounts(req.body);
        await newAccount.save();
        req.flash('success', 'tạo tài khoản thành công');
        res.redirect('back')
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
   
}

// [GET] admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    if(res.locals.role.permissions.includes('account_edit')){
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
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    if(res.locals.role.permissions.includes('account_edit')){
        const id = req.params.id;

        if(req.body.password == "") {
            delete req.body.password;
        } else {
            req.body.password = md5(req.body.password);
        }
        req.body.updatedBy = res.locals.account.id; // cập nhật tài khoản update
        await Accounts.updateOne({
            _id: id,
            deleted: false
        }, req.body);
    
        req.flash("success", "Cập nhật thành công!");
    
        res.redirect("back");
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [DELETE] admin/accounts/delete-account/:id
module.exports.deleteAccount = async (req, res) => {
    if(res.locals.role.permissions.includes('account_delete')){
        await Accounts.updateOne({
            _id : req.params.id,
            deleted : false,
        }, {
            deletedBy : res.locals.account.id, // cập nhật tài khoản delete acc
            deleted : true,
        });
    
        res.json({
            code : 200
        })
    } else {
        res.json({
            code : 300 // k co quyen
        })
    }
    
}

// [PATCH] admin/accounts/change-status/:status/:id
module.exports.changeStatusAccount = async (req, res) => {
    if(res.locals.role.permissions.includes('account_view')){
        await Accounts.updateOne({
            _id : req.params.id,
            deleted : false,
        }, {
            status : req.params.status,
        });
    
        res.json({
            code : 200
        })
    } else {
        res.json({
            code : 300 // k co quyen
        })
    }
    
}