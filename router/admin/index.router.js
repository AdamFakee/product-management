const dashboardRouter = require('./dashboard.router');
const productRouter = require('./product.router');
const trashRouter = require('./trash.router');
const productsCategoryRoute = require("./product-category.router");
const roleRouter = require("./role.router");
const accountRouter = require('./account.router');
const authRouter = require('./auth.router');
const profileRouter = require('./profile.router');
const accoutnClientRouter = require('./account-client.router');
const resetTokenRouter = require('./resetToken.router');
const uploadMceRouter = require('./upload-tinymce.router');
const systemConfig = require("../../config/system");
const authMiddleware = require('../../middlewares/admin/auth.middleware');
module.exports.index = (app) => {
    const path = `/${systemConfig.prefixAdmin}`;
    app.use(
        path +'/dashboard',
        authMiddleware.requireAuth,
        dashboardRouter
    );
    app.use(
        path +'/products',
        authMiddleware.requireAuth,
        productRouter
    );
    app.use(
        `${path}/products-category`, 
        authMiddleware.requireAuth,
        productsCategoryRoute
    );
    app.use(
        path +'/trash',
        authMiddleware.requireAuth, 
        trashRouter
    );
    app.use(
        path +'/roles',
        authMiddleware.requireAuth, 
        roleRouter
    );
    app.use(
        path +'/accounts',
        authMiddleware.requireAuth, 
        accountRouter
    );
    app.use(
        `${path}/profile`, 
        authMiddleware.requireAuth,
        profileRouter
    );
    app.use(
        `${path}/account-clients`, 
        authMiddleware.requireAuth,
        accoutnClientRouter
    );
    app.use(
        `${path}/upload`, 
        authMiddleware.requireAuth,
        uploadMceRouter
    );
    app.use(path +'/auth', authRouter);
    app.use(path + '/reset-token', resetTokenRouter);
}