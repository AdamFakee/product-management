const mongoose = require("mongoose");

const oderSchema = new mongoose.Schema({
    userInfo : {
        fullName : String,
        address : String,
        phone : Number,
    },
    products : [
        {
            productId : String,
            quantity : Number,
            discountPercentage : Number,
            price : Number,
        }
    ]
    
}, {
  timestamps: true
});

const Oder = mongoose.model("Oder", oderSchema, "oders");

module.exports = Oder;