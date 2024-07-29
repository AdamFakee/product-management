
// file này là để tổng hợp 2 file nhánh lại

const homeRouter = require('./home.router');
const productRouter = require('./product.router');
const searchRouter = require('./search.router');
const cartRouter = require('./cart.router');
const checkoutRouter = require('./checkout.router');
const addressRouter = require('./address.router');
const orderRouter = require('./order.router');
const userRouter = require('./user.router');
const cartMiddleware = require('../../middlewares/client/cart.middleware');


module.exports.index = (app) => {
    app.use(cartMiddleware.cartId)

    app.use("/", homeRouter);
    app.use('/products', productRouter);
    app.use('/search', searchRouter);
    app.use('/cart', cartRouter);
    app.use('/checkout', checkoutRouter)
    app.use('/address', addressRouter);
    app.use('/order', orderRouter);
    app.use('/user', userRouter);
}