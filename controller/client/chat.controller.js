const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const paginationHelper = require('../../helpers/pagination.helper');

// [GET] /chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const limitMess = 20; // chỉ hiển thị 20 tin nhắn
    const paginationMessage = await paginationHelper(req, {}, Chat, limitMess); // phân trang của mess
    const totalPageMess = paginationMessage.totalPage;  // tổng số trang có thể load 
    // SocketIO
    _io.once("connection", (socket) => {  // người dùng kết nối đến 1 lần
        // CLIENT_SEND_MESSAGE
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const chatData = {
                userId: userId,
                content: data.content,
                fullName : res.locals.user.fullName
            };
        
            //Lưu data vào database
            const chat = new Chat({
                userId: userId,
                content: data.content
            });
            await chat.save();
        
            // Trả tin nhắn realtime về cho mọi người 
            _io.emit('SERVET_SEND_MESSAGE', chatData);
        })
        //CLIENT_LOAD_MORE_MESSAGE
        socket.on('CLIENT_LOAD_MORE_MESSAGE', async (currentPage) => {          // người dùng yêu cầu xem thêm tin nhắn lúc trước
            const skipMess = (parseInt(totalPageMess - currentPage))*limitMess;
            const chats = await Chat.find({}).sort({
                createdAt : 'desc'
            }).skip(skipMess).limit(limitMess);  // lấy ra số lượng tin nhắn - tạo sau lấy trước
            for (const chat of chats) {
                const infoUser = await User.findOne({
                    _id: chat.userId
                });
                chat.fullName = infoUser.fullName;
            }
            socket.emit('SERVER_SEND_MORE_MESS', chats); // server trả tin nhắn về cho người dùng
        })
        // End CLIENT_LOAD_MORE_MESSAGE
      });
        // End SocketIO
        
    const chats = await Chat.find({}).sort({
        createdAt : 'desc'
    }).limit(limitMess);  // hiển thị số tin nhắn khi người dùng vô lần đầu
    
    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.userId
        });
    
        chat.fullName = infoUser.fullName; // thêm tên - nếu là người khác gửi đến thì hiển thị thêm tên
        }
    chats.reverse(); // in ra xem vì sao cần đảo ngược
    res.render('client/pages/chat/index.pug', {
        chats : chats, 
        paginationMessage : paginationMessage
    });
}