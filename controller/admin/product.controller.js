const products = require('../../models/product.model');
module.exports = async (req, res) => {
    const productList = await products.find({});
    res.render('admin/pages/products/index', {
        pageTitle : "trang san pham",
        productList: productList
    });
}