const productCategory = require('../../models/product-category.model');
const createTreeHelper = require('../../helpers/createTree.helper');

module.exports = async (req, res,next) => {
    const categoryProducts = await productCategory.find({
        status : 'active',
        deleted : false,
    })
    const newCategoryProducts = createTreeHelper(categoryProducts);
    res.locals.newCategoryProducts = newCategoryProducts;
    next();
}