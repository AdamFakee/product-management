const express = require("express");
const multer  = require('multer');
const router = express.Router();

const controller = require("../../controller/admin/product-category.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const upload = multer();

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create", 
  upload.single('thumbnail'),
  uploadCloud.uploadSingle,
  controller.createPost
);

module.exports = router;