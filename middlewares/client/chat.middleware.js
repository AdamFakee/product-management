
// check admin account
module.exports.checkAdmin = (req, res, next) => {
    const user = res.locals.user;
    if(user.role=='admin'){
        next();
    }else {
        req.flash('error', 'tài khoản không có quyền truy cập link này');
        res.redirect('/');
    }
}

// check room-chat-id 
module.exports.checkRoomChatId = (req, res, next) => {
    const user = res.locals.user; // room-chat-id trong database
    const roomChatId = req.params.roomChatId; // room-chat-id lấy trên router
    if(user.roomChatId == roomChatId){
        next();
    } else {
        res.redirect('/');
    }
}