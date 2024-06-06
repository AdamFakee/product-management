// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/product-management');
// const dataAlign = mongoose.model('product', {
//   title: String,
//   description: String,
//   price: Number,
//   discountPercentage: Number,
//   stock: Number,
//   thumbnail: String,
//   status: String,
//   position: Number,
//   deleted: Boolean
// })


module.exports.index = async (req, res) => {
  res.render("client/pages/products/index", {
    pageTitle: 'trang danh sach san pham'

  });
  }
