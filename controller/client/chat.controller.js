const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const paginationHelper = require('../../helpers/pagination.helper');
const moment = require('moment');

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    let roomChatId;
    if(res.locals.user.role=='admin'){
        roomChatId = req.params.roomChatId; // admin join room to chat with client
    }else {
        roomChatId = res.locals.user.roomChatId; // client chat to admin
    }
    const limitMess = 20; // chỉ hiển thị 20 tin nhắn
    const paginationMessage = await paginationHelper(req, {}, Chat, limitMess); // phân trang của mess
    const totalPageMess = paginationMessage.totalPage;  // tổng số trang có thể load 
    // SocketIO
    _io.once("connection", (socket) => {  // người dùng kết nối đến 1 lần
        socket.join(roomChatId)
        // CLIENT_SEND_MESSAGE
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const chatData = {
                userId: userId,
                content: data.content,
                fullName : res.locals.user.fullName
            };
        
            // //Lưu data vào database
            const chat = new Chat({
                roomChatId : roomChatId,
                userId: userId,
                content: data.content
            });
            await chat.save();
        
            // Trả tin nhắn realtime về cho mọi người 
            _io.to(roomChatId).emit('SERVET_SEND_MESSAGE', chatData);
        })
        //CLIENT_LOAD_MORE_MESSAGE
        socket.on('CLIENT_LOAD_MORE_MESSAGE', async (currentPage) => {          // người dùng yêu cầu xem thêm tin nhắn lúc trước
            const skipMess = (parseInt(totalPageMess - currentPage))*limitMess;
            const chats = await Chat.find({
                roomChatId : roomChatId,
            }).sort({
                createdAt : 'desc'
            }).skip(skipMess).limit(limitMess);  // lấy ra số lượng tin nhắn - tạo sau lấy trước
            for (const chat of chats) {
                const infoUser = await User.findOne({
                    _id: chat.userId
                });
                chat.fullName = infoUser.fullName;
            }
            socket.to(roomChatId).emit('SERVER_SEND_MORE_MESS', chats); // server trả tin nhắn về cho người dùng
        })
        // End CLIENT_LOAD_MORE_MESSAGE
      });
        // End SocketIO
        
    const chats = await Chat.find({
        roomChatId : roomChatId,
    }).sort({
        createdAt : 'desc',
    }).limit(limitMess);  // hiển thị số tin nhắn khi người dùng vô lần đầu
    
    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.userId,
        });
    
        chat.fullName = infoUser.fullName; // thêm tên - nếu là người khác gửi đến thì hiển thị thêm tên
        }
    chats.reverse(); // in ra xem vì sao cần đảo ngược
    res.render('client/pages/chat/index.pug', {
        chats : chats, 
        paginationMessage : paginationMessage
    });
}

// [GET] /chat/list-room-chat
module.exports.listRoomChat = async (req, res) => {
    const listUser = await User.find({ roomChatId: { $exists: true } }); // những ai có roomChatId
    for(const user of listUser){
        const newMessage = await Chat.findOne({   // tin nhắn mới nhất
            roomChatId : user.roomChatId,
        }).sort({
            creatAt : 'desc'
        }).limit(1);
        if(newMessage){
            const timeSending = moment(newMessage.creatAt).format("ddd, hA");  //thời gian gửi tin nhắn
            user.newMessage = newMessage.content;
            user.timeSending = timeSending;
        }
    }
    // console.log(listUser)
    res.render('client/pages/chat/listChat', {
        listUser : listUser
    });
}