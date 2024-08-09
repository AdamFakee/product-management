const express = require('express');
const router = express.Router();

const controller = require('../../controller/client/chat.controller');
const chatMiddleware = require('../../middlewares/client/chat.middleware');


router.get('/:roomChatId', chatMiddleware.checkRoomChatId, controller.index);
router.get('/admin/list-room-chat',chatMiddleware.checkAdmin, controller.listRoomChat); // tài khoản admin mới được phép vô
module.exports = router;