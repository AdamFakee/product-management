const Accounts = require('../../models/account.model');

module.exports.index = (req, res) => {
    res.render('admin/pages/profiles/index');
}

//  [POST]  admin/profile/upload-avatar
module.exports.uploadAvatar = async (req, res) => {
    console.log(req.file);
}