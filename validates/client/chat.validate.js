const User = require("../../models/user.model");

// check admin account
module.exports.checkAdmin = (req, res, next) => {
    const user = res.locals.user;
    if(!user) {
        res.redirect('/');
        return;
    }
    if(user.role=='admin'){
        next();
    }else {
        req.flash('error', 'tài khoản không có quyền truy cập link này');
        res.redirect('/');
    }
}

// check room-chat-id 
module.exports.checkRoomChatId = async (req, res, next) => {
    const user = res.locals.user; // room-chat-id trong database
    const roomChatId = req.params.roomChatId; // room-chat-id lấy trên router
    if(!user) {
        res.redirect('/');
        return;
    }
    if(user.role=='admin'){   // check acc user
        const checkAcc = await User.findOne({
            roomChatId : roomChatId,
        });
        if(checkAcc){
            next();
            return;
        } 
    }
    if(user.roomChatId == roomChatId){ // client chat với admin => client đc chỉ định vô duy nhất 1 phòng, vô sai cook
        next();
    } else {
        res.redirect('/');
    }
}