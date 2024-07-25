const Products = require('../../models/product.model');
const ProductCategory = require('../../models/product-category.model');
const paginationHelper = require('../../helpers/pagination.helper');
// [GET] /products
module.exports.index = async (req, res) => {
  const pagination = await paginationHelper(req, {
    status : 'active',
    delete : false,
  }, Products, 6);;
  const productList = await Products
    .find({
      status : 'active',
      deleted : 'false',
    })
    .skip(pagination.skipProduct)
    .limit(pagination.limitProduct);
  for (const item of productList) {
    item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
  }
  res.render('client/pages/products/index', {
    pageTitle: 'trang danh sach san pham',
    products : productList,
    pagination : pagination
  });
}

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;

  const product = await Products.findOne({
    slug: slug,
    deleted: false,
    status: "active"
  });

  product.priceNew = ((1 - product.discountPercentage/100) * product.price).toFixed(0);

  if(product) {
    res.render("client/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product
    });
  } else {
    res.redirect("/");
  }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const slug = req.params.slugCategory;
  const pagination = paginationHelper(req, {
    status : 'active',
    deleted : false,
  }, Products, 6);
  const category = await ProductCategory.findOne({
    slug : slug,
    deleted : false,
    status : 'active',
  });

  const allSubCategory = []; // chứa id danh mục hiện tại và tất cả id của các danh mục con - con của con

  const getSubCategory = async (currentId) => { // tìm id của các danh mục con
    const subCategory = await ProductCategory.find({
      parent_id: currentId,
      status: "active",
      deleted: false
    });
    for (const sub of subCategory) {
      allSubCategory.push(sub.id);
      await getSubCategory(sub.id);
    }
  }

  await getSubCategory(category.id);

  const products = await Products.find({ // sản phẩm thuộc danh mục x
    product_category_id : {
      $in: [
        category.id,
        ...allSubCategory,
      ]
    },
    status : 'active',
    deleted : false,
  }).sort({
    position : 'desc',
  });


 // tính giá mới
  for (const item of products) {
    item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
  }
  // edn tinh giá mới

  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: products,
    pagination : pagination
  });
}