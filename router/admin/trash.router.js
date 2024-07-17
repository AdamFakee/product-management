const express = require('express');
const router = express.Router();
const controller = require('../../controller/admin/trash.controller');
router.get('/', controller.index);
router.get('/products', controller.product);
router.get('/roles', controller.role);
router.get('/accounts', controller.account);
router.get('/product-category', controller.productCategory);
router.patch('/restore-item/:model/:id', controller.restoreItem); // vd : /trash/restore-item/products/:id, /trash/restore-item/roles/:id ...
router.delete('/delete-permanently/:model/:id', controller.deleteItem);
router.patch('/change-multi-status/:model', controller.changeMultiStatus);
module.exports = router;