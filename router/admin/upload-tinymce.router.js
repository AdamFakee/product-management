const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');


const controller = require('../../controller/admin/upload-tinymce.controller');

router.post('/', upload.single('file'), uploadCloud.uploadSingle, controller);

module.exports = router;