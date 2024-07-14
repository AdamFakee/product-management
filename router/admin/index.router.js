const dashboardRouter = require('./dashboard.router');
const productRouter = require('./product.router');
const trashRouter = require('./trash.router');
const productsCategoryRoute = require("./product-category.router");
const roleRouter = require("./role.router");
const accountRouter = require('./account.router');
const authRouter = require('./auth.router');
const systemConfig = require("../../config/system");
module.exports.index = (app) => {
    const path = `/${systemConfig.prefixAdmin}`;
    app.use(path +'/dashboard', dashboardRouter);
    app.use(path +'/products', productRouter);
    app.use(`${path}/products-category`, productsCategoryRoute);
    app.use(path +'/trash', trashRouter);
    app.use(path +'/roles', roleRouter);
    app.use(path +'/accounts', accountRouter);
    app.use(path +'/auth', authRouter);
}