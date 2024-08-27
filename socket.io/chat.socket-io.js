const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const paginationHelper = require('../helpers/pagination.helper');
const chatSocketHelper = require('../helpers/chat-socket.helper');
module.exports = async (req, res, roomChatId) => {
    const userId = res.locals.user.id;
    let limitMess = 20; // chỉ hiển thị 20 tin nhắn
    const paginationMessage = await paginationHelper(req, {}, Chat, limitMess); // phân trang của mess
    let remainMess = paginationMessage.number;
    const totalMess = paginationMessage.number;  // tổng số trang có thể load 
    let newRoom = roomChatId; // id phòng chat
    // SocketIO
    _io.once("connection", (socket) => {  // người dùng kết nối đến 1 lần
        socket.join(newRoom)
        // CLIENT_SEND_MESSAGE
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const chatData = {
                userId: userId,
                content: data.content,
            };
            //Lưu data vào database
            const chat = new Chat({
                roomChatId : roomChatId,
                userId: userId,
                content: data.content
            });
            await chat.save();
        
            // Trả tin nhắn realtime về cho mọi người 
            _io.to(newRoom).emit('SERVET_SEND_MESSAGE', chatData);
        })
        //CLIENT_LOAD_MORE_MESSAGE
        socket.on('CLIENT_LOAD_MORE_MESSAGE', async (currentPage) => {    // người dùng yêu cầu xem thêm tin nhắn lúc trước
            let skipMess = totalMess - (currentPage + 1)*limitMess;
            if(skipMess < 0){
                skipMess = 0;
                limitMess = remainMess;
            } else {
                remainMess -= totalMess - skipMess;
            }
            console.log(skipMess, limitMess, remainMess)
            const chats = await Chat.find({
                roomChatId : roomChatId,
            }).skip(skipMess).limit(limitMess);  // lấy ra số lượng tin nhắn - tạo sau lấy trước
            if(chats.length){
                chats.reverse();
                socket.emit('SERVER_SEND_MORE_MESS', chats); // server trả tin nhắn về cho người dùng
            }
        })
        // End CLIENT_LOAD_MORE_MESSAGE

        // CLIENT_CHOOSE_USER
        socket.on('CLIENT_CHOOSE_USER', async userId => {
            const user = await User.findOne({
                _id : userId,
            });
            const totalPage = paginationMessage.totalPage;
            if(user){
                limitMess = 20;
                remainMess = paginationMessage.number;
                socket.leave(newRoom);  // rời phòng chat hiện tại
                newRoom = user.roomChatId // làm mới id phòng chat
                socket.join(newRoom); // vào phòng chat được chọn
                const listMess = await chatSocketHelper.showMess(limitMess, newRoom);
                socket.emit('SERVER_RETURN_CHOOSE_USER', {
                    user : user,  // người được chọn
                    listMess : listMess, 
                    totalPage : totalPage,
                })
            }
        })
        // End CLIENT_CHOOSE_USER

      });
    // End SocketIO
}