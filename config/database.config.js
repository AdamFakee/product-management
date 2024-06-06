// const mongoose = require('mongoose');
// module.exports.connect = async () => {
//     try {
//         await mongoose.connect('mongodb://localhost:27017/product-management');
//         console.log("connect completely");
//     } catch (error) {
//         console.log('connect incompletely');
//     }
// }

const mongoose = require('mongoose');

module.exports.connect = async () => {
try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Kết nối database thành công!");
} catch (error) {
// console.log(error);
    console.log("Kết nối database thất bại!");
}
}