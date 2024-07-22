const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

// [GET] /cart
module.exports.index = async(req, res) => {
    const cart = await Cart.findOne({
        _id : req.cookies.cartId,
    });

    const total = cart.products; // sản phẩm trong giỏ hàng

    cart.totalPrice = 0;  // tổng đơn hàng của toàn bộ sản phẩm trong giỏ 

    for(const item of total){
        const product = await Product.findOne({
            _id : item.productId,
        }).select('price title thumbnail slug discountPercentage');

        item.priceNew = (1 - product.discountPercentage/100) * product.price;
        item.total = item.quantity*item.priceNew; // tổng giá của loại sản phẩm này
        cart.totalPrice += item.total; // tổng giá toàn giỏ hàng
        item.title = product.title;
        item.thumbnail = product.thumbnail;
    }
    res.render('client/pages/cart/index.pug', {
        cartDetail : cart,
    });
}

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

// [GET] cart/delete/:productId
module.exports.delete = async (req, res) => {
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;
    await Cart.updateOne({
        _id : cartId,
    }, {
        $pull : {
            "products" : {
                'productId' : productId,
            }
        }
    })
    res.redirect('back');
}
