const products = require('../../models/product.model');
module.exports.index = async (req, res) => {
  const productList = await products.find({});
  console.log(productList)
  res.render('client/pages/products/index', {
    pageTitle: 'trang danh sach san pham',
    productList:productList
  });
}