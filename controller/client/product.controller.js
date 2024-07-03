const products = require('../../models/product.model');
module.exports.index = async (req, res) => {
  const productList = await products.find({});
  for (const item of productList) {
    item.newPrice = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
  }
  res.render('client/pages/products/index', {
    pageTitle: 'trang danh sach san pham',
    productList:productList
  });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;

  const product = await products.findOne({
    slug: slug,
    deleted: false,
    status: "active"
  });

  if(product) {
    res.render("client/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product
    });
  } else {
    res.redirect("/");
  }
}