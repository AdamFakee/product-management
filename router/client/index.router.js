
// file này là để tổng hợp 2 file nhánh lại

const homeRouter = require('./home.router');
const productRouter = require('./product.router');
const categoryMiddleware = require('../../middlewares/client/category.middleware');


module.exports.index = (app) => {
    app.use(categoryMiddleware)
    app.use("/", homeRouter);
    app.use('/products', productRouter);
}