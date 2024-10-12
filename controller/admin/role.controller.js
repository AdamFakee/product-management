const Role = require('../../models/role.model');
const Accounts = require('../../models/account.model');
const systemConfig = require('../../config/system.js');

// [GET] admin/roles
module.exports.index = async (req, res) => {
    if(res.locals.role.permissions.includes('role_view')){
        const records = await Role.find({
            deleted : false,
        });
        res.render('admin/pages/roles/index.pug', {
            pageTitle : 'Nhóm quyền',
            records : records,
        })
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [GET] admin/roles/create
module.exports.create = (req, res) => {
    if(res.locals.role.permissions.includes('role_create')){
        res.render('admin/pages/roles/create.pug');
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [POST] admin/roles/create
module.exports.createPost = async (req, res) => {
    if(res.locals.role.permissions.includes('role_view')){
        req.body.createdBy = res.locals.account.id; // cập nhật tài khoản tạo quyền
        const newRole = new Role(req.body);
        await newRole.save();
        req.flash('success', 'thêm mới quyền thành công');
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}


// [GET] admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    if(res.locals.role.permissions.includes('role_edit')){
        try {
            const permision = await Role.findOne({
                _id : req.params.id,
            });
            res.render('admin/pages/roles/edit.pug', {
                pageTitle : 'Chỉnh sửa quyền',
                permision : permision,
            });
        } catch (error) {
            res.redirect('/admin/roles');
        }
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [PATCH] admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    if(res.locals.role.permissions.includes('role_edit')){
        try {
            req.body.updatedBy = res.locals.account.id; // cập nhật tài khoản update quyền
            await Role.updateOne({
                _id : req.params.id,
            }, req.body);
            req.flash('success', 'cập nhật quyền thành công');
            res.redirect('back');
       } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/roles`)
       }
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
   
}

// [GET] admin/roles/permissions
module.exports.permissions = async (req, res) => {
    if(res.locals.role.permissions.includes('role_view')){
        const records = await Role.find({
            deleted : false,
        });
        res.render('admin/pages/roles/permission.pug', {
            pageTitle : 'Phân quyền',
            records : records
        })
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    }
    
}

// [PATCH] admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    if(res.locals.role.permissions.includes('role_edit')){
        for (const role of req.body) {
            await Role.updateOne({
              _id: role.id,
              deleted: false
            }, {
              updatedBy : res.locals.account.id, // cập nhật tài khoản update quyền
              permissions: role.permissions
            });
          }
        req.flash('success', 'cập nhật thành công')
        res.json({
            code : 200
        })
    } else {
        res.json({
            code : 300 // k co quyen
        })
    }
    
}

// [DELETE] admin/roles/delete-role/:id
module.exports.deleteRole = async (req, res) => {
    try {
        if(res.locals.role.permissions.includes('role_delete')){
            // xóa (mềm) quyền
            await Role.updateOne({
                _id : req.params.id,
                deleted : false,
            }, {
                deletedBy : res.locals.account.id, // cập nhật tài khoản xóa quyền
                deleted : true,
            });
    
            // xóa (mềm) các account có quyền này
            await Accounts.updateMany({
                role_id : req.params.id,
                deleted : false
            }, {
                deleted : true,
            })
    
            res.json({
                code : 200,
            })
        } else {
            res.json({
                code : 300 // k cos quyen
            })
        }
    } catch (error) {
        res.json({
            code : 400
        })
    }
    
}