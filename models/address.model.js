const mongoose = require("mongoose");
// lưu thông tin khách hàng - giống bên shopee
const addressSchema = new mongoose.Schema({
  
  cartId : String,  // id giỏ hàng
  info : [
    {
      phone : String,
      address : String,
      fullName : String,
      default : {          // là địa chỉ mặc định hay k
        type : Boolean,
        default : 'false',
      }
    }
  ]
}, {
  timestamps: true
});

const address = mongoose.model("Address", addressSchema, "address");

module.exports = address;