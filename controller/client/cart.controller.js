const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

// [GET] /cart
module.exports.index = async(req, res) => {
    const cart = res.locals.cart;

    const total = cart.products; // sản phẩm trong giỏ hàng

    cart.totalPrice = 0;  // tổng đơn hàng của toàn bộ sản phẩm trong giỏ 

    let checkAll = 0; // bao nhiêu sản phẩm trong giỏ hàng được chọn

    for(const item of total){
        const productInfo = await Product.findOne({
            _id : item.productId,
            status : 'active',
            deleted : 'false',
        }).select('price title thumbnail slug discountPercentage');

        productInfo.priceNew = (1 - productInfo.discountPercentage/100) * productInfo.price;

        item.productInfo = productInfo; // object trong object

        item.total = item.quantity*productInfo.priceNew; // tổng giá của loại sản phẩm này
        if(item.inCart){ // sản phẩm được chọn 
            checkAll++;
            cart.totalPrice += item.total; // tổng giá toàn giỏ hàng
        }
    }
    checkAll = (checkAll == total.length ? true : false)  // true => checkAll.checked = true
    res.render('client/pages/cart/index.pug', {
        cartDetail : cart,
        checkAll : checkAll,
    });
}

// [PATCH] /cart/:amount
module.exports.indexPatch = async (req, res) => {
    const productId = req.body.productId;
    const amount = req.params.amount; // kí hiệu riêng 
    switch(amount) {
        case '1' : // chọn 1 sản phẩm trong giỏ hàng để mua
            await Cart.updateOne({
                _id : req.cookies.cartId,
                'products.productId' : productId,
            }, {
                $set: {
                    'products.$.inCart' : `true`,
                }
            });
            break;
        case '2' : // chọn tất cả
            await Cart.updateOne({
                _id : req.cookies.cartId,
            }, {
                $set: {
                    'products.$[].inCart' : 'true',
                }
            });
            
            break;
        case '0' : // hủy chọn 1 sản phẩm trong giỏ hàng
            await Cart.updateOne({
                _id : req.cookies.cartId,
                'products.productId' : `${productId}`,
            }, {
                $set: {
                    'products.$.inCart' : `false`,
                }
            });
            break;
        case '3' : // hủy tất cả
            await Cart.updateOne({
                _id : req.cookies.cartId,
            }, {
                $set: {
                    'products.$[].inCart' : 'false',
                }
            });
            break;
    }
    res.json({
        code : 200,
    })
}

//  [GET] cart/add/:productId
module.exports.addPost = async (req, res) => {
    try {
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
    } catch (error) {
        res.redirect('back')
    }
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

// [GET] cart/update/:quantity
module.exports.update = async (req, res) => {
    const quantity = req.params.quantity;
    const productId = req.params.productId;
    await Cart.updateOne({
        _id : req.cookies.cartId,
        'products.productId' : `${productId}`,
    }, {
        $set: {
            'products.$.quantity' : `${quantity}`,
        }
    })
    res.redirect('back');
}