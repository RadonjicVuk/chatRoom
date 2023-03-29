import express from "express"
import {Server} from "socket.io"
import http from "http"
import {formatMessage} from "./utils/messages.js"
import { userJoin, currentUser, userLeave, getRoomUsers } from "./utils/users.js"
const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static('public'))

io.on('connection', (socket) => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room)
        
        socket.join(user.room)

        socket.emit("message", formatMessage('Bot',`Welcome`))
        socket.broadcast.to(user.room).emit('message', formatMessage('Bot',`${user.username} has joined the chat`))
        
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
    
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message', formatMessage('Bot',`${user.username} has left the chat`))
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })

    socket.on('chatMessage', (message) => {
        const user = currentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username,message))
    })


})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`))