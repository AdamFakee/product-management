import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'


var socket = io();

const chatBox = document.querySelector('[body-box]');


// CLIENT_CHOOSE_USER
const userChoosen = document.querySelectorAll('[user-chat-room]');
if(userChoosen.length){
  userChoosen.forEach(user => {
    user.addEventListener('click', () => {
      const userId = user.getAttribute('user-chat-room');  // id của người dùng được admin chọn để chat
      socket.emit('CLIENT_CHOOSE_USER', userId);
    })
  })
}
// End CLIENT_CHOOSE_USER

// SERVER_RETURN_CHOOSE_USER
socket.on('SERVER_RETURN_CHOOSE_USER', data => {
  const user = data.user;  // id người được chọn
  const listMess = data.listMess; // 20 tin nhắn
  const totalPage = data.totalPage;
  const headBoxChat = document.querySelector(`[head-box-chat]`);
  if(headBoxChat){
    headBoxChat.querySelector('.inner-title .inner-name').innerHTML = user.fullName;
  }
  const userId = document.querySelector('[my-id]').getAttribute('my-id');
  document.querySelector('[box-chat]').remove(); // xóa hết nội dung của box-chat

  // tạo nội dung mới cho box-chat
  const boxChat = document.createElement('div');
  boxChat.classList.add('inner-chat');
  boxChat.setAttribute('box-chat', '');
  boxChat.setAttribute('my-id', userId);
  boxChat.setAttribute('current-page', 1);
  boxChat.setAttribute('total-page', totalPage);
  listMess.forEach(mess => {
    const div = document.createElement('div');
    if(mess.userId == user._id){   // check tin nhắn đến - tin nhắn đi
      div.classList.add('inner-coming');
      div.innerHTML = mess.content;
    } else {
      div.classList.add('inner-going');
      div.innerHTML = mess.content;
    }
    boxChat.appendChild(div);
  })
  
  const bodyBox = document.querySelector('[body-box]');
  bodyBox.appendChild(boxChat); 
})
// End SERVER_RETURN_CHOOSE_USER

// SERVER_RETURN_SEEN_MESS
if(userChoosen){
  userChoosen.forEach(user => {
    const userId = user.getAttribute('user-chat-room');
    socket.on('SERVER_RETURN_SEEN_MESS', data => {
      if(userId == data){
        const title = user.querySelector('.inner-title');
        title.classList.remove('no-seen');
      }
    })
  })
}
// End SERVER_RETURN_SEEN_MESS

// CLIENT_SEND_MESSAGE
const formChat = document.querySelector("[form-sent-message]");
if(formChat) {
  formChat.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    const img = event.target.content['image-in-message'];
    console.log(img)
    if(content) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content
      });
      event.target.content.value = "";
    }
  })
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_TYPING
if(chatBox) {
  socket.on('SERVER_RETURN_TYPING', (status) => {
    const typingBox = chatBox.querySelector('[box-typing]');
    if(status == 'show') {
      if(!typingBox) {   // 1 người dùng hiển thị 1 typing
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute('box-typing', '');
        boxTyping.innerHTML = `
          <div class="inner-dots"><span></span><span></span><span></span></div>
        `;
        chatBox.appendChild(boxTyping)
      }
    } else {
      if(typingBox) {
        chatBox.removeChild(typingBox);
      }
    }
  })
}
// End SERVER_RETURN_TYPING

// CLIENT_WRITE_MESSAGE 
let typingTimeOut;
if(formChat) {
  formChat.addEventListener('keyup' , () => {
    socket.emit('CLIENT_WRITE_MESSAGE', 'show');

    clearTimeout(typingTimeOut);
    
    typingTimeOut = setTimeout(() => {
      socket.emit('CLIENT_WRITE_MESSAGE', 'hidden');
    }, 3000);
  })
}
// End CLIENT_WRITE_MESSAGE 


// SERVER_SEND_MESSAGE
socket.on('SERVET_SEND_MESSAGE', chatData => {
  const body = document.querySelector("[box-chat]"); // để chèn vào cuối đoạn chat
  const userId = document.querySelector('[my-id]').getAttribute('my-id'); 
  console.log(userId)
  const newLine = document.createElement('div'); // dòng tin nhắn mới
  if(chatData.userId == userId){
    newLine.classList.add('inner-going');
  } else {
    newLine.classList.add('inner-coming');
  }
  newLine.innerHTML= chatData.content ; // nội dung tin nhắn mới
  body.appendChild(newLine);
})
// End SERVER_SEND_MESSAGE

// SERVER_RETURN_MAX_SCROLL
if(chatBox){
  socket.on('SERVER_RETURN_MAX_SCROLL', () => {
    chatBox.scrollTop = chatBox.scrollHeight;
  })
}
// End SERVER_RETURN_MAX_SCROLL

// SERVER_RETURN_MESS_DEMO
if(userChoosen){
  userChoosen.forEach(user => {
    const userId = user.getAttribute('user-chat-room');
    socket.on('SERVER_RETURN_MESS_DEMO', (data) => {
      if(userId == data.userId){
        const demoMess = user.querySelector('.inner-mess');
        const demoTimeSending = user.querySelector('.inner-time');
        const title = user.querySelector('.inner-title');
        if(demoMess.firstChild){
          demoMess.removeChild(demoMess.firstChild);
          demoTimeSending.removeChild(demoTimeSending.firstChild);
        }
        
        title.classList.add('no-seen');
        demoMess.innerHTML = data.content;
        demoTimeSending.innerHTML = data.timeSending;
      }
    })
  })
}
// End SERVER_RETURN_MESS_DEMO

// load thêm tin nhắn cũ
if(chatBox){
  // CLIENT_LOAD_MORE_MESSAGE
  chatBox.addEventListener('scroll', ()=> { // lắng nghe scroll
    let currentPage = document.querySelector('[current-page]').getAttribute('current-page'); // trang hiển thị message hiện tại
    let totalPage = document.querySelector('[total-page]').getAttribute('total-page'); // lấy tổng số trang có thể load đc
    totalPage = parseInt(totalPage);
    currentPage = parseInt(currentPage);
    const scrollValue = chatBox.scrollTop;

    if(scrollValue == 0){  // scroll lên trên hết mức có thể
      if(currentPage < totalPage){
        socket.emit('CLIENT_LOAD_MORE_MESSAGE', currentPage); // phát ra yêu cầu cho sever
        document.querySelector('[current-page]').setAttribute('current-page', parseInt(currentPage)+1); // cập nhập currentPage
      }
    }
  })
  // End CLIENT_LOAD_MORE_MESSAGE


  // SERVER_SEND_MORE_MESS
  socket.on('SERVER_SEND_MORE_MESS', (data) => {
    const userId = document.querySelector('[my-id]').getAttribute('my-id'); // id người dùng
    data.forEach(mess => {
      const oldLine = document.createElement('div'); // dòng tin nhắn cũ cần load
      if(mess.userId == userId){ // mình nhắn
        oldLine.classList.add('inner-going');
      } else { // người khác nhắn đến
        oldLine.classList.add('inner-coming'); 
      }
      oldLine.innerHTML = mess.content;

      const chatBody = chatBox.querySelector('[box-chat]');;
      chatBody.insertBefore(oldLine, chatBody.firstElementChild) // chèn lên đầu
    });
  })
  // End SERVER_SEND_MORE_MESS
}
// end load thêm tin nhắn cũ


// // emoji-picker-element : icon chat
// const emojiPicker = document.querySelector('emoji-picker');
// if(emojiPicker) {
//   const inputChat = document.querySelector(".chat .inner-form input[name='content']");

//   emojiPicker.addEventListener('emoji-click', (event) => {
//     const icon = event.detail.unicode;
//     inputChat.value = inputChat.value + icon;
//   });
// }
// // End emoji-picker-element

// // Show Popup Icon
// const buttonIcon = document.querySelector("[button-icon]");
// if(buttonIcon) {
//   const tooltip = document.querySelector('.tooltip');
//   Popper.createPopper(buttonIcon, tooltip);

//   buttonIcon.addEventListener("click", () => {
//     tooltip.classList.toggle('shown');
//   });
// }
// // End Show Popup Icon