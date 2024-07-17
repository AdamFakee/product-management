const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  title: String,
  description: String,
  permissions: {
    type: Array,
    default: []
  },
  updatedBy : String,  // tài khoản update data
  createdBy : String, // tài khoản tạo data
  deletedBy : String,// tài khoản xóa data
  deleted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;