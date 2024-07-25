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

// [POST] /checkout/order
module.exports.orderPost = async (req, res) => {
    const userInfo = {    // thông tin người dùng
        fullName : req.body.fullName,
        phone : req.body.phone,
        address : req.body.address,
    };

    const cart = await Cart.findOne({
        _id : req.cookies.cartId,
    });

    const products = [];  // thông tin sản phẩm người dùng đặt trong đơn hàng
    const productInCart = []; // các sản phẩm được đặt
    
    for(const item of cart.products){
        if(item.inCart){
            productInCart.push(item);

            const productInfo = await Product.findOne({
                _id : item.productId,
            }).select('price discountPercentage');

            products.push({
                productId : item.productId,
                quantity : item.quantity,
                discountPercentage : productInfo.discountPercentage,
                price : productInfo.price,
            });
        }
    }
    // thêm mới đơn hàng
    const newOrder = new Oder({
        userInfo : userInfo,
        products : products
    });
    await newOrder.save();


    // xóa các sản phẩm đã được đặt trong giỏ hàng
    for(const item of productInCart){
        await Cart.updateOne({
            _id : req.cookies.cartId,
        }, {
            $pull : {
                'products' : item
            }
        })
    }

    // giảm các sản phẩm trong giỏ hàng xuống, do đơn mua đã được đặt
    for(const item of productInCart){
        await Product.updateOne({
            _id : item.productId,
        }, {
            $inc : {
                stock : -(item.quantity)
            }
        })
    }
    res.redirect(`/checkout/success/${newOrder.id}`);
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    const orderId = req.params.orderId;
  
    const order = await Oder.findOne({
        _id: orderId
    });
  
    let totalPrice = 0;
  
    for (const item of order.products) {
        const productInfo = await Product.findOne({
            _id: item.productId,
            status : 'active',
            deleted : 'false',
        });
    
        item.thumbnail = productInfo.thumbnail;
        item.title = productInfo.title;
        item.priceNew = (1 - item.discountPercentage/100) * item.price;
        item.totalPrice = item.priceNew * item.quantity;
        totalPrice += item.totalPrice;
    }
  
    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order: order,
        totalPrice: totalPrice
    });
};