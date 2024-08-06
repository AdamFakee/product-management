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