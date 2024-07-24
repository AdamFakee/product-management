const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: String,
      quantity: Number,
      inCart : {
        type : Boolean,
        default : 'false',
      }, //sản phẩm được chọn để đặt hàng
    }
  ]
}, {
  timestamps: true
});

const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;