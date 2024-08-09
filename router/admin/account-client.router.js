const express = require('express');
const router = express.Router();
const controller = require('../../controller/admin/account-client.controller');
const multer  = require('multer');
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const validate = require("../../validates/admin/account.validate");

const upload = multer();

router.get('/', controller.index);

router.get('/create', controller.create);
router.post(
    '/create',
    upload.single('avatar'),
    uploadCloud.uploadSingle,
    validate.createAccount,
    controller.createPost
);

router.get('/edit/:id', controller.edit);
router.patch(
    '/edit/:id',
    upload.single('avatar'),
    uploadCloud.uploadSingle,
    validate.editPatch,
    controller.editPatch
);


// router.delete('/delete-account/:id', controller.deleteAccount);
// router.patch('/change-status/:status/:id', controller.changeStatusAccount)

module.exports = router;