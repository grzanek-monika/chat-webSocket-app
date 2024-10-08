// eslint-disable-next-line no-undef
const socket = io();

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName;

socket.on('message', ({ author, content }) => addMessage(author, content));

const login = (event) => {
    event.preventDefault();
    if(userNameInput.value){
        userName = userNameInput.value;
        socket.emit("join", userName );
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
    } else {
        alert("Enter your login!");
    }
}

const addMessage = (author, content) => {
    const message = document.createElement("li");
    message.classList.add("message");
    message.classList.add("message--received");
    if(author === userName){
        message.classList.add("message--self");
    }
    message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content" id="content">
      ${content}
    </div>
  `;

    messagesList.appendChild(message);
    if(author === "Chat Bot") {
        const contentMsg = document.getElementById("content");
        contentMsg.classList.add("chatBot");
    }
}

const sendMessage = (event) => {
    event.preventDefault();
    if(messageContentInput.value) {
        addMessage(userName, messageContentInput.value);
        socket.emit("message", {author: userName, content: messageContentInput.value});
        messageContentInput.value = "";
    } else {
        alert("Message is empty!")
    }
}

loginForm.addEventListener('submit', (e) => {
    login(e);
});

addMessageForm.addEventListener('submit', (e) => {
    sendMessage(e);
})