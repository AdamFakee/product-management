const mongoose = require('mongoose');
const dataAlign = mongoose.model('product', {
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: Boolean
}, 'products');
module.exports = dataAlign;