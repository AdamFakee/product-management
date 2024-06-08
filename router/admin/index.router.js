const dashboardRouter = require('./dashboard.router');
module.exports.index = (app) => {
    app.use('/admin/dashboard', dashboardRouter);
}