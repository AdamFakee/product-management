
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
  title: String,
  description: {
    type:String,
    default:''
  },
  product_category_id : {
    type : String,
    default: '',
  },
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  featured:Boolean, // sản phẩm nổi bật
  updatedBy : String,  // tài khoản update data
  createdBy : String, // tài khoản tạo data
  deletedBy : String,// tài khoản xóa data
  deleted: {
    type: Boolean,
    default: false
  },
  slug: {  // để cho con bot gg phân tích đc gì gì đó 
    type: String,
    slug: "title",
    unique: true // nếu 2 sp cùng tên thì phân biệt nhau = cách đánh thêm chuỗi random để phân biệt 
   }
}, {
  timestamps : true,
});

module.exports = mongoose.model('Product', productSchema, 'products'); 