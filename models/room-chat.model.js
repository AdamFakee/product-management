const mongoose = require('mongoose');

const roomChatSchema = new mongoose.Schema({
    type : String, // phòng mấy người
    title : String, // tên phòng chat
    users : [
        {
            userId : String,
            role : String, // quyền : vd nhóm trưởng, nhóm phó
        }
    ]
}, {
    timestamps : true
})