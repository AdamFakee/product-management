const constroller = require('../../controller/admin/product.controller');
const express = require("express");
const multer  = require('multer');
const storageMulterHelper = require('../../helpers/storageMulter.helper');
const upload = multer({ storage: storageMulterHelper.storage })
const router = express.Router();
const validate = require("../../validates/admin/product.validate");
router.get('/', constroller.index);
router.patch('/change-status/:statusChange/:id', constroller.changeStatus);
router.patch('/change-multi-status', constroller.changeMultiStatus);
router.delete('/delete-item/:id', constroller.deleteItem);
router.get('/create', constroller.create);
router.post('/create', upload.single('thumbnail'),validate.createPost, constroller.createPost);  // trong router thì mấy controller cũng đc và chạy theo tuần tự
 // phương thức post chỉ chạy khi submit form => validate : back => quay lại router với phương thức post
module.exports = router;