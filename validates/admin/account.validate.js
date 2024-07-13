module.exports.createAccount = (req, res, next) => {
    if(!req.body.fullName){
        req.flash('error', 'tên k được để trống');
        res.redirect('back');
        return;
    }
    if(!req.body.email){
        req.flash('error', 'email k được để trống');
        res.redirect('back');
        return;
    }
    if(!req.body.password){
        req.flash('error', 'password k được để trống');
        res.redirect('back');
        return;
    }

    next();
};

module.exports.editPatch = (req, res, next) => {
    if(!req.body.fullName){
        req.flash('error', 'tên k được để trống');
        res.redirect('back');
        return;
    }
    if(!req.body.email){
        req.flash('error', 'email k được để trống');
        res.redirect('back');
        return;
    }
    next();
}