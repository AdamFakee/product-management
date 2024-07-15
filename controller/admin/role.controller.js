const Role = require('../../models/role.model');
const Accounts = require('../../models/account.model');
const systemConfig = require('../../config/system.js');

// [GET] admin/roles
module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted : false,
    });
    res.render('admin/pages/roles/index.pug', {
        pageTitle : 'Nhóm quyền',
        records : records,
    })
}

// [GET] admin/roles/create
module.exports.create = (req, res) => {
    res.render('admin/pages/roles/create.pug');
}

// [POST] admin/roles/create
module.exports.createPost = async (req, res) => {
    const newRole = new Role(req.body);
    await newRole.save();
    req.flash('success', 'thêm mới quyền thành công');
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}


// [GET] admin/roles/edit/:id
module.exports.edit = async (req, res) => {
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
}

// [PATCH] admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
   try {
        console.log(req.body)
        await Role.updateOne({
            _id : req.params.id,
        }, req.body);
        req.flash('success', 'cập nhật quyền thành công');
        res.redirect('back');
   } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles`)
   }
}

// [GET] admin/roles/permissions
module.exports.permissions = async (req, res) => {
    const records = await Role.find({
        deleted : false,
    });
    res.render('admin/pages/roles/permission.pug', {
        pageTitle : 'Phân quyền',
        records : records
    })
}

// [PATCH] admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    for (const role of req.body) {
        await Role.updateOne({
          _id: role.id,
          deleted: false
        }, {
          permissions: role.permissions
        });
      }
    res.json({
        code : 200
    })
}

// [DELETE] admin/roles/delete-role/:id
module.exports.deleteRole = async (req, res) => {

    // xóa (mềm) quyền
    await Role.updateOne({
        _id : req.params.id,
        deleted : false,
    }, {
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
}