const Chat = require('../models/chat.model');


// show list message flow fomat
module.exports.showMess = async (limitMess, roomChatId) => {
    const listMess = await Chat.find({
        roomChatId : roomChatId,
    }).sort({
        createdAt : 'desc',
    }).limit(limitMess);  // hiển thị số tin nhắn khi người dùng vô lần đầu
    if(listMess.length){
        listMess.reverse(); // in ra xem vì sao cần đảo ngược
    };

    return listMess;
}
