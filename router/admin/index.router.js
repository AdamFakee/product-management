const dashboardRouter = require('./dashboard.router');
const productRouter = require('./product.router');
const systemConfig = require("../../config/system");
module.exports.index = (app) => {
    const path = `/${systemConfig.prefixAdmin}`;
    app.use(path +'/dashboard', dashboardRouter);
    app.use(path +'/products', productRouter);
}