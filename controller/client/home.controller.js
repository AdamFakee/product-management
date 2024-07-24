const Products = require('../../models/product.model');


module.exports.index = async (req, res) => {
    const featuredProducts = await Products.find({  // sản phẩm nổi bật
        featured : true,
        status : 'active',
        deleted : false,
    }).sort({
        position : 'desc',
    }).limit(6);

    for(const item of featuredProducts){
        item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
    };

    const newProducts = await Products.find({   // sản phẩm mới nhất
        status : 'active',
        deleted : false,
    }).sort({
        position : 'desc',
    }).limit(6);

    for(const item of newProducts){
        item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
    }

    res.render("client/pages/home/index", {
        pageTitle : 'trang chu',
        newProducts : newProducts,
        featuredProducts : featuredProducts,
    });
 }