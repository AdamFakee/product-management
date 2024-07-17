const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const accounts = new mongoose.Schema({
  fullName : String,
  email : String,
  phone : Number,
  password : {
    type : String,
    default : '',
  },
  token : String,
  avatar : String, 
  role_id : String,   // các quyền được cấp ở chỗ phân quyền
  status : String,   
  updatedBy : String,  // tài khoản update data
  createdBy : String, // tài khoản tạo data
  deletedBy : String,// tài khoản xóa data 
  deleted : {
    type : Boolean,
    default : false,
  },
  countLogin : Number, // đếm số lần đăng nhập sai trong 1 lượt đăng nhập, quá 5 => status == inactive   else => về 1
}, {
  timestamps : true,
});

module.exports = mongoose.model('account', accounts, 'accounts'); 