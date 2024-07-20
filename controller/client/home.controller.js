const Products = require('../../models/product.model');


module.exports.index = async (req, res) => {
    const featuredProducts = await Products.find({  // sản phẩm nổi bật
        featured : true,
        status : 'active',
        deleted : false,
    }).sort({
        position : 'desc',
    }).limit(6);

    const newProducts = await Products.find({   // sản phẩm mới nhất
        status : 'active',
        deleted : false,
    }).sort({
        position : 'desc',
    }).limit(6);

    res.render("client/pages/home/index", {
        pageTitle : 'trang chu',
        newProducts : newProducts,
        featuredProducts : featuredProducts,
    });
 }