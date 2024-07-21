const express = require('express');

const router = express.Router();

const controller = require('../../controller/client/product.controller');
router.get('/', controller.index);

// chi tiet san pham
router.get("/detail/:slug", controller.detail);

// hiển thị sản phẩm của từng danh mục sản phẩm
router.get('/:slugCategory', controller.category);

module.exports = router;