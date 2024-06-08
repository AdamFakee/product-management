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

