const Cart = require('../../models/cart.model');

//  [GET] cart/add/:productId
module.exports.addPost = async (req, res) => {
    const quantity = parseInt(req.body.quantity); // số lượng sản phẩm
    const productId = req.params.productId; // id sản phẩm
    const cartId = req.cookies.cartId; // id giỏ hàng 

    const cart = await Cart.findOne({
        _id : cartId,
    });

    // check đã tồn tại sản phẩm đó trong giỏ hàng hay chưa
    const exitProduct = cart.products.find(item => {
        return item.productId == productId;
    });

    if(exitProduct){
        // update lại số lượng
        await Cart.updateOne({
            _id : cartId,
            'products.productId' : `${productId}`,
        }, {
            $set: {
                'products.$.quantity' : `${quantity}`,
            }
        })
    } else {
        // add sản phẩm mới vô giỏ hàng
        await Cart.updateOne({
            _id : cartId,
        }, {
            $push: {
                products : {
                    productId : productId,
                    quantity : quantity,
                }
            }
        })
    }
    
    res.redirect('back');
}