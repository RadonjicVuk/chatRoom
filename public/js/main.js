const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userUl = document.getElementById('users')
const socket = io()
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

socket.emit('joinRoom', {username, room})

socket.on('message', (message) => {
    outputMessage(message)

    chatMessages.scrollTop = chatMessages.scrollHeight
})

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room)
    console.log(room);
    outputUsers(users)
})

chatForm.addEventListener('submit', sendMessage)

function sendMessage(e){
    e.preventDefault()

    const message = e.target.msg.value
    socket.emit('chatMessage', message)

    e.target.msg.value = ''
    e.target.msg.focus()

}

function outputRoomName(room) {
    roomName.innerText = room
}

function outputUsers(users) {  
    userUl.innerHTML = '';
    console.log(users);
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userUl.appendChild(li);
    });
}

function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}