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
            res.locals.cart = cart;
            res.locals.cartTotal = cart.products.length || 0; // số sản phẩm trong đơn hàng
            next();
        return;
        } catch (error) {
            req.flash('error', 'token bị sai');
            res.redirect('/user/logout');
            return;
        }

    }

    // chưa đăng nhập => để cartTotal = 0
    res.locals.cartTotal = 0; // số sản phẩm trong giỏ hàng
    next()
}

// chọn sản phẩm mới được đặt hàng
module.exports.checkout = async (req, res, next) => {
    try {
        const payload = jwt.verify(req.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findOne({
            status : 'active',
            deleted : false,
            _id : payload.id,
        })
        const cart = await Cart.findOne({
            _id : user.cartId,
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
        next();
        return;
    } catch (error) {
        req.flash('error', 'token bị sai');
        res.redirect('/user/logout');
        return;
    }
    
}