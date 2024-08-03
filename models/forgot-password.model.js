const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
    email : String,
    OTP : String,
    'expireAt':{
        type : Date,
        default: Date.now() + 3 * 60 * 1000,
    }
}, {
    timestamps : true,
})

const forgotPassword = mongoose.model(
    'ForgotPassword',
    forgotPasswordSchema,
    'forgot-password',
)

module.exports = forgotPassword;