const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    password: String,
    avatar: String,
    cartId : String,
    roomChatId : String,
    role:String,  // role : k có data => client, role=admin => tài khoản admin
    status: {
        type: String,
        default: "active"
    },
    refreshToken : {
        type : String,
        default : null
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;