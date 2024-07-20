const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const controller = require('../../controller/admin/profile.controller');

router.get('/', controller.index);
router.post(
    '/upload-avatar', 
    upload.single('avatar'),
    uploadCloud.uploadSingle,
    controller.uploadAvatar);

    
module.exports = router;