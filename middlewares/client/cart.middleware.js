const Cart = require('../../models/cart.model');
const Address = require('../../models/address.model');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');

// tạo cookie cho giỏ hàng của tài khoản 
module.exports.cartId = async (req, res, next) => {
    // tạo tài khoản rồi thì làm như thế này 
    if(req.cookies.accessToken) {
        try {
            const payload = jwt.verify(req.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findOne({
                status : 'active',
                deleted : false,
                _id : payload.id,
            })
            res.cookie(
                'cartId', 
                user.cartId, 
                { expires: new Date(Date.now() + 365*24*60*60*1000)}); // đơn vị milisecond

            const cart = await Cart.findOne({
                _id: user.cartId
                });
            res.locals.cartTotal = cart.products.length || 0; // số sản phẩm trong đơn hàng
            next();
        return;
        } catch (error) {
            req.flash('error', 'token bị sai');
            res.redirect('/user/logout');
            return;
        }

    }

    // lúc đầu chưa có cái token thì làm như thế này để tạo ra 1 cái cart cho những người dùng k tạo tài khoản
    if(!req.cookies.cartId){
        const newCart = new Cart(); // taọ mới giỏ hàng
        await newCart.save();

        const newAddress = new Address({  // tạo data chứa địa chỉ theo cartId
            cartId : newCart.id,
        });
        await newAddress.save();

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

// chọn sản phẩm mới được đặt hàng
module.exports.checkout = async (req, res, next) => {
    const cart = await Cart.findOne({
        _id : req.cookies.cartId,
    });
    const checkInCart = cart.products.find(item => {
        return item.inCart == true;
    })
    if(checkInCart){
        next();
    } else {
        req.flash('error', 'vui lòng chọn sản phẩm');
        res.redirect('back');
    }
}