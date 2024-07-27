
module.exports.checkAddress = (req, res, next) => {
    const {fullName, phone, address} = req.body;
    if(fullName && phone && address){
        next();
    } else  {
        req.flash('error', 'cần nhập đầy đủ các trường thông tin');
        res.redirect('back')
    }
}