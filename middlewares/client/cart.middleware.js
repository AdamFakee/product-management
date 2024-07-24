const Cart = require('../../models/cart.model');


// tạo cookie cho giỏ hàng của tài khoản 
module.exports.cartId = async (req, res, next) => {
    if(!req.cookies.cartId){
        const newCart = new Cart();
        await newCart.save();
        res.cookie(
            'cartId', 
            newCart.id, 
            { expires: new Date(Date.now() + 365*24*60*60*1000)}); // đơn vị milisecond
    } else {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
          });
        res.locals.cartTotal = cart.products.length || 0; // số sản phẩm trong đơn hàng
    }
    next()
}