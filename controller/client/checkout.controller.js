const Oder = require('../../models/oder.model');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model')
//  [GET] /checkout
module.exports.index = async (req, res) => {
    const cart = await Cart.findOne({
        _id : req.cookies.cartId,
    });
    cart.totalPrice = 0;
    for(const item of cart.products){
        const productInfo = await Product.findOne({
            _id : item.productId,
        }).select('price title thumbnail slug discountPercentage');

        productInfo.priceNew = (1 - productInfo.discountPercentage/100) * productInfo.price;
        item.total = item.quantity*productInfo.priceNew; // tổng giá của loại sản phẩm này
        if(item.inCart){ // sản phẩm được chọn
            cart.totalPrice += item.total; // tổng giá toàn giỏ hàng
        }
        item.productInfo = productInfo;
    }
    res.render('client/pages/checkout/index', {
        cartDetail : cart,
    })
}