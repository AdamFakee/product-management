const Product = require('../../models/product.model');

module.exports.checkQuantity = async (req, res, next) => {  // check số lượng sản phẩm khách muốn mua
    const productId = req.params.productId;
    const productQuantity = req.params.quantity || req.body.quantity; // số lượng sản phẩm khách muốn thay đổi || muốn mua
    const product = await Product.findOne({
        _id : productId,
    });
    
    if(productQuantity > product.stock || productQuantity <= 0){
        req.flash('error', `sản phẩm vượt quá số lượng hàng trong kho, còn ${product.stock} sản phẩm`);
        res.redirect('back');
    } else {
        next();
    }
}

