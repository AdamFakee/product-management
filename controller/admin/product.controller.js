const products = require('../../models/product.model');
module.exports = async (req, res) => {
    const find = {
        deleted : false
    }
    if(req.query.status){
        find.status = req.query.status;
    }
    const productList = await products.find(find);
    res.render('admin/pages/products/index', {
        pageTitle : "trang san pham",
        productList: productList
    });
}