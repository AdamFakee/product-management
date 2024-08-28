const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const moment = require('moment');
const paginationHelper = require('../helpers/pagination.helper');
const chatSocketHelper = require('../helpers/chat-socket.helper');
module.exports = async (req, res, roomChatId) => {
    const userId = res.locals.user.id;
    let limitMess = 20; // chỉ hiển thị 20 tin nhắn
    const paginationMessage = await paginationHelper(req, {}, Chat, limitMess); // phân trang của mess
    let remainMess = paginationMessage.number; // số lượng tin nhắn còn lại chưa hiển thị 
    const totalMess = paginationMessage.number;  // tổng số trang có thể load 
    let newRoom = roomChatId; // id phòng chat
    console.log('remain : ', remainMess)
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

            // fomat timeSending
            chatData.timeSending = moment(chat.createdAt).fromNow();
            // End fomat timeSending
        
            // Trả tin nhắn realtime về cho mọi người 
            _io.to(newRoom).emit('SERVET_SEND_MESSAGE', chatData);

            // nhắn xong thì scrollTop = scrollHeight
            socket.emit('SERVER_RETURN_MAX_SCROLL');

            // hiển thị tin nhắn demo cho bên admin - bên client k cần
            _io.emit('SERVER_RETURN_MESS_DEMO', chatData)
        })
        //CLIENT_LOAD_MORE_MESSAGE
        socket.on('CLIENT_LOAD_MORE_MESSAGE', async (currentPage) => {    // người dùng yêu cầu xem thêm tin nhắn lúc trước
            let skipMess = totalMess - (currentPage+1)*limitMess; // số tin nhắn cần bỏ qua

            // trường hợp skipMess < 0 => có thể có tin nhắn bị bỏ qua - hay bị lỗi gì đó
            if(skipMess < 0){ 
                skipMess = 0;
                limitMess = remainMess;
            } else {
                remainMess = skipMess; // cập nhật số tin nhắn còn lại chưa hiển thị
            }
            console.log('remain : ', remainMess, '  skip : ', skipMess, '  limit : ', limitMess);
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
            const totalPage = paginationMessage.totalPage; // tổng số trang 
            if(user){
                // đổi người dùng mới => cập nhật lại
                limitMess = 20;
                remainMess = paginationMessage.number;

                socket.leave(newRoom);  // rời phòng chat hiện tại
                newRoom = user.roomChatId // làm mới id phòng chat
                socket.join(newRoom); // vào phòng chat được chọn

                const listMess = await chatSocketHelper.showMess(limitMess, newRoom); // số tin nhắn hiển thị cho trang tiếp theo
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