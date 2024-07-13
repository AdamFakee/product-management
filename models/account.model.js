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
  deleted : {
    type : Boolean,
    default : false,
  }
}, {
  timestamps : true,
});

module.exports = mongoose.model('account', accounts, 'accounts'); 