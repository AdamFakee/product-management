const productCategory = require('../../models/product-category.model');
const createTreeHelper = require('../../helpers/createTree.helper');

module.exports = async (req, res,next) => {
    const category = myCache.get('category'); // danh mục sản phẩm 
    if(category != null) {
        res.locals.newCategoryProducts = category;
    } else {
        const categoryProducts = await productCategory.find({
            status : 'active',
            deleted : false,
        })
        const newCategoryProducts = createTreeHelper(categoryProducts);
        res.locals.newCategoryProducts = newCategoryProducts;
        myCache.set('category', newCategoryProducts, 3600); // save in cache
    }
    next();
}