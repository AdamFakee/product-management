const Address = require('../../models/address.model');

// [GET] /address
module.exports.index = async (req, res) => {
    const address = await Address.findOne({
        cartId : req.cookies.cartId,
    });
    res.render('client/pages/address/index.pug', {
        address : address,
    })
}

// [GET] /address/create
module.exports.create = async (req, res) => {
    res.render('client/pages/address/create.pug')
}

// [POST] /address/create
module.exports.createPost = async (req, res) => {
    const info = {
        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address,
    }
    
    await Address.updateOne({
        cartId : req.cookies.cartId,
    }, {
        $addToSet : {
            'info' : info,
        }
    });

    req.flash('success', 'tạo mới địa chỉ thành công');
    res.redirect('/address');
}

// [PATCH] /address/default
module.exports.addressDefault = async (req, res) => {
    const id = req.body.id;
    const defaultStatus = req.body.default;
    if(defaultStatus){ // đổi mặc định => default=false => set địa chỉ được chọn : default=true
        await Address.updateOne({
            cartId : req.cookies.cartId,
        }, {
            $set : {
                'info.$[].default' : false,
            }
        });
      
        await Address.updateOne({
            cartId : req.cookies.cartId,
            'info._id' : id,
        }, {
            $set : {
                'info.$.default' : defaultStatus,
            }
        });
    } else { // bỏ chọn mặc định
        await Address.updateOne({
            cartId : req.cookies.cartId,
            'info._id' : id,
        }, {
            $set : {
                'info.$.default' : defaultStatus,
            }
        });
    }
    
    
    res.json({
        code : 200
    })
}