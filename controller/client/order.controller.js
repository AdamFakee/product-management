const Order = require('../../models/oder.model');
const moment = require('moment'); // chuyển ngày theo format

module.exports.index = async (req, res) => {
    const order = await Order.find({ // tìm đơn hàng
        cartId : req.cookies.cartId,
    });
    const kindofOrder = {
        confirmed : [],   // đơn hàng đã đc xác nhận
        pending : [],    // đang chờ xác nhận
        shipping : [],  // đang vận chuyển
        delivered : [], // đã giao
    };
    order.forEach(item => {
        item.createdAtFormat = moment(item.createdAt).format('DD/MM/YYYY')
        kindofOrder[item.status].push(item);
    });
    res.render('client/pages/order/index', {
        listOrder : kindofOrder,
        order : order
    })
}