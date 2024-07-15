const systemConfig = require('../../config/system');
const Accounts = require('../../models/account.model');

module.exports.requireAuth = async (req, res, next) => {
    if(!req.cookies.token){
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    } 

    const account = await Accounts.findOne({
        token : req.cookies.token,
        deleted : false,
    });

    if(!account){
        res.redirect(`/${systemConfig}/auth/login`);
        return;
    }
    next();
}