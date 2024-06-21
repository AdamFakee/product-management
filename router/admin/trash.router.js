const express = require('express');
const router = express.Router();
const controller = require('../../controller/admin/trash.controller');
router.get('/', controller.index);
router.patch('/restore-item/:id', controller.restoreItem);
router.delete('/delete-permanently/:id', controller.deleteItem);
//router.delete('/h/delete-permanently', controller.deletePermanently);
module.exports = router;