const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require('../../helpers/createTree.helper.js');
// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  if(res.locals.role.permissions.includes('product-category_view')){
    const records = await ProductCategory.find({
      deleted : false,
      status : 'active'
    });
    res.render("admin/pages/products-category/index", {
      pageTitle: "Danh mục sản phẩm",
      records : records
    });
  } else {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  if(res.locals.role.permissions.includes('product-category_create')){
    const categories = await ProductCategory.find({
      deleted: false,
      status : 'active'
    });
    const newCategory = createTreeHelper(categories, '');
    res.render("admin/pages/products-category/create", {
      pageTitle: "Thêm mới danh mục sản phẩm",
      categories: newCategory
    });
  } else {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if(res.locals.role.permissions.includes('product-category_create')){
    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countCagegory = await ProductCategory.countDocuments({});
      req.body.position = countCagegory + 1;
    }
    req.body.createdBy = res.locals.account.id; // cập nhật tài khoản tạo danh mục
    const newCategory = new ProductCategory(req.body);
    await newCategory.save();
  
    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
  } else {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
}

// [GET] admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  if(res.locals.role.permissions.includes('product-category_edit')){
    try {
      const id = req.params.id;
      const category = await ProductCategory.findOne({
        _id : id,
        deleted : false,
        status : 'active'
      });

      const listcategories = await ProductCategory.find({
        deleted : false,
        status : 'active'
      });
  
      const newCategory = createTreeHelper(listcategories, "");
      res.render('admin/pages/products-category/edit.pug', {
        pageTitle : 'chỉnh sửa danh mục sản phẩm',
        category : category,
        newCategory : newCategory
      })
    } catch (error) {
      res.redirect('/admin/products-category')
    }
  } else {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
}

// [PATCH] admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  if(res.locals.role.permissions.includes('product-category_edit')){
    try {
      if(req.body.position){
        req.body.position = parseInt(req.body.position);
      } else {
        const count = await ProductCategory.countDocuments({});
        req.body.position = count + 1;
      }
      req.body.updatedBy = res.locals.account.id; // cập nhật tài khoản chỉnh sửa danh mục
      await ProductCategory.updateOne({
        _id : req.params.id,
        status : 'active',
        deleted : false,
      }, req.body)

      myCache.del('category'); // xóa cái cũ trong cache
      res.redirect('back');

    } catch (error) {
      res.redirect('/admin/products-category')
    }
  } else {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
}

// [DELETE] admin/product-category/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  try {
    if(res.locals.role.permissions.includes('product-category_delete')){
      await ProductCategory.updateOne({
        _id : req.params.id,
        deleted : false,
        status : 'active'
      }, {
        deletedBy : res.locals.account.id, // cập nhật tài khoản xóa danh mục
        deleted : true,
      })
      
      res.json({
        code : 200,
      })
    } else {
      res.json({
        code : 300 // k co quyen
      })
    }
  } catch (error) {
    res.redirect('back');
  }
}

// [PATCH] admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    if(res.locals.role.permissions.includes('product-category_delete')){
      const {status, id} = req.params;
      await ProductCategory.updateOne({
        _id : id,
        deleted : false,
        status : 'active'
      }, {
        status : status,
      });
      res.json({
        code : 200
      })
    } else {
      res.json({
        code : 300 // k có quyền
      })
    }
  } catch (error) {
    res.redirect('back')
  }
}