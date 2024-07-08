const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require('../../helpers/createTree.helper.js');
// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const records = await ProductCategory.find({
    deleted : false,
  });
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records : records
  });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  const categories = await ProductCategory.find({
    deleted: false
  });
  
  const newCategory = createTreeHelper(categories, '');
  res.render("admin/pages/products-category/create", {
    pageTitle: "Thêm mới danh mục sản phẩm",
    categories: newCategory
  });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if(req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countCagegory = await ProductCategory.countDocuments({});
    req.body.position = countCagegory + 1;
  }

  const newCategory = new ProductCategory(req.body);
  await newCategory.save();

  res.redirect(`/${systemConfig.prefixAdmin}/products-category`);

}

// [GET] admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await ProductCategory.findOne({
      _id : id,
      deleted : false,
    });
    const listcategories = await ProductCategory.find({
      deleted : false
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
}

// [PATCH] admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    if(req.body.position){
      req.body.position = parseInt(req.body.position);
    } else {
      const count = await ProductCategory.countDocuments({});
      req.body.position = count + 1;
    }
    if(req.file){
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    await ProductCategory.updateOne({
      _id : req.params.id,
    }, req.body)
    res.redirect('back');
  } catch (error) {
    res.redirect('/admin/products-category')
  }
}