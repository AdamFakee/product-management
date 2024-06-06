const mongoose = require('mongoose');
module.exports = () => {
    try {
        mongoose.connect('mongodb://localhost:27017/product-management');
        console.log("connect completely");
    } catch (error) {
        console.log('connect incompletely');
    }
}