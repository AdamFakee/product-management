const express = require('express');
const router = express.Router();

const controller = require('../../controller/client/chat.controller');
const chatValidate = require('../../validates/client/chat.validate');


router.get('/:roomChatId', chatValidate.checkRoomChatId, controller.index);
router.get('/admin/list-room-chat',chatValidate.checkAdmin, controller.listRoomChat); // tài khoản admin mới được phép vô
module.exports = router;