import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'


var socket = io();

// CLIENT_SEND_MESSAGE
const formChat = document.querySelector(".chat .inner-form");
if(formChat) {
  formChat.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    if(content) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content
      });
      event.target.content.value = "";
    }
  })
}
// End CLIENT_SEND_MESSAGE

// SERVER_SEND_MESSAGE
socket.on('SERVET_SEND_MESSAGE', chatData => {
  const body = document.querySelector(".chat .inner-body"); // để chèn vào cuối đoạn chat
  const userId = document.querySelector('[my-id]').getAttribute('my-id'); // id người dùng
  const newLine = document.createElement('div'); // dòng tin nhắn mới
  let fullName = '';
  if(chatData.userId == userId){
    newLine.classList.add('inner-outgoing');
  } else {
    newLine.classList.add('inner-incoming');
    fullName = `<div class="inner-name"> ${chatData.fullName} </div> ` // hiển thị fullname
  }
  newLine.innerHTML=`
    ${fullName}
    <div class='inner-content'> ${chatData.content} </div>
  `; // nội dung tin nhắn mới
  body.appendChild(newLine)
})
// End SERVER_SEND_MESSAGE

// Scroll Chat To Bottom
const chatBody = document.querySelector(".chat .inner-body");
if(chatBody) {
  chatBody.scrollTop = chatBody.scrollHeight;
}
// End Scroll Chat To Bottom

// load thêm tin nhắn cũ
if(chatBody){
  chatBody.addEventListener('scroll', ()=> { // lắng nghe scroll
    const scrollValue = chatBody.scrollTop;
    if(scrollValue == 0){  // scroll lên trên hết mức có thể
      const currentPage = document.querySelector('[current-page]').getAttribute('current-page'); // trang hiển thị message hiện tại
      let totalPage = document.querySelector('[total-page]').getAttribute('total-page'); // lấy tổng số trang có thể load đc
      totalPage = parseInt(totalPage);
      if(currentPage < totalPage){
        socket.emit('CLIENT_LOAD_MORE_MESSAGE', currentPage); // phát ra yêu cầu cho sever
        socket.on('SERVER_SEND_MORE_MESS', (data) => {
          const userId = document.querySelector('[my-id]').getAttribute('my-id'); // id người dùng
          data.forEach(mess => {
            const oldLine = document.createElement('div'); // dòng tin nhắn cũ cần load
            let fullName = '';
            if(mess.userId == userId){ // mình nhắn
              oldLine.classList.add('inner-outgoing');
            } else { // người khác nhắn đến
              oldLine.classList.add('inner-incoming'); 
              fullName = `<div class="inner-name"> ${mess.fullName} </div> ` // hiển thị fullname
            }
            oldLine.innerHTML = `
              ${fullName}
              <div class='inner-content'> ${mess.content} </div>
            `
            chatBody.insertBefore(oldLine, chatBody.firstElementChild) // chèn lên đầu
          });
        })
        if(currentPage <= totalPage - 1){
          document.querySelector('[current-page]').setAttribute('current-page', parseInt(currentPage)+1); // cập nhập currentPage
        }
      }
    }
  })
}
// end load thêm tin nhắn cũ


// emoji-picker-element : icon chat
const emojiPicker = document.querySelector('emoji-picker');
if(emojiPicker) {
  const inputChat = document.querySelector(".chat .inner-form input[name='content']");

  emojiPicker.addEventListener('emoji-click', (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;
  });
}
// End emoji-picker-element

// Show Popup Icon
const buttonIcon = document.querySelector("[button-icon]");
if(buttonIcon) {
  const tooltip = document.querySelector('.tooltip');
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle('shown');
  });
}
// End Show Popup Icon