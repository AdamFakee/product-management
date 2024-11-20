const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const paginationHelper = require('../../helpers/pagination.helper');
const moment = require('moment');
const chatSocket = require('../../socket.io/chat.socket-io')
const chatSocketHelper = require('../../helpers/chat-socket.helper');
// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
    const roomChatId = req.params.roomChatId;
    const limitMess = 20; // chỉ hiển thị 20 tin nhắn

    // socket-io
    await chatSocket(req, res, roomChatId);
    // End socket-io

    const listMess = await chatSocketHelper.showMess(limitMess, roomChatId); // số tin nhắn hiển thị mặc định - lần đầu vào 
    const paginationMessage = await paginationHelper(req, {}, Chat, limitMess); // phân trang của mess
    res.render('client/pages/chat/index.pug', {
        user : res.locals.user,
        listMess : listMess, 
        paginationMessage : paginationMessage
    });
}

// [GET] /chat/list-room-chat
module.exports.listRoomChat = async (req, res) => {
    const listUser = await User.find({
        $and : {
            roomChatId: { $exists: true },
            _id : {$ne : res.locals.user}
        } 
    }).select('-email -password -password -cartId -loginWith -role -refreshToken'); // những ai có roomChatId
    const limitMess = 20; // chỉ hiển thị 20 tin nhắn
    for(const user of listUser){
        const newMess = await Chat.find({   // tin nhắn mới nhất
            roomChatId : user.roomChatId,
        }).sort({
            $natural : -1
        }).limit(1);
        const newMessage = newMess[0];
        if(newMessage){
            const timeSending = moment(newMessage.creatAt).format("ddd, hA");  //thời gian gửi tin nhắn
            user.newMessage = newMessage.content;
            user.timeSending = timeSending;
            user.originalTime = newMessage.createdAt; // thời gian gửi tin nhắn - chưa fomat
            user.seen = newMessage.seen;
        } else {
            user.originalTime = 0;
        }
    }
    listUser.sort((a, b) => {
        return b.originalTime - a.originalTime; // nhắn sau hiển thị cao hơn 
    })
    const lastUser = listUser[0]; // nguời dùng nhắn tin gần nhất - hiển thị mặc định

    // socket-io
    let listMess, paginationMessage;
    if(lastUser) {
        await chatSocket(req, res, lastUser.roomChatId);
        listMess = await chatSocketHelper.showMess(limitMess, lastUser.roomChatId); // số tin nhắn hiển thị 
        paginationMessage = await paginationHelper(req, {}, Chat, limitMess); // phân trang của mess
    }
    // End socket-io

    res.render('client/pages/chat/listChat', {
        listUser : listUser,
        listMess : listMess,
        lastUser : lastUser,
        paginationMessage : paginationMessage
    });
}