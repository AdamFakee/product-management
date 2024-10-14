
// file này là để tổng hợp 2 file nhánh lại

const homeRouter = require('./home.router');
const productRouter = require('./product.router');
const searchRouter = require('./search.router');
const cartRouter = require('./cart.router');
const checkoutRouter = require('./checkout.router');
const addressRouter = require('./address.router');
const orderRouter = require('./order.router');
const userRouter = require('./user.router');
const chatRouter = require('./chat.router');
const cartMiddleware = require('../../middlewares/client/cart.middleware');
const userMiddleware = require('../../middlewares/client/user.middleware');

module.exports.index = (app) => {
    app.use('/user', userRouter); // dont run through middleware

    app.use(cartMiddleware.cartId);

    app.use("/", userMiddleware.checkCustomer, homeRouter);
    app.use('/products', userMiddleware.checkCustomer, productRouter);
    app.use('/search', userMiddleware.checkCustomer, searchRouter);
    app.use('/cart', userMiddleware.infoUser, cartRouter);
    app.use('/checkout', userMiddleware.infoUser, checkoutRouter)
    app.use('/address', userMiddleware.infoUser, addressRouter);
    app.use('/order', userMiddleware.infoUser, orderRouter);
    app.use('/chat', userMiddleware.infoUser, chatRouter);
}