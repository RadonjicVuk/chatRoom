import express from "express"
import path from "path"
import {Server} from "socket.io"
import http from "http"

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static('public'))

io.on('connection', (socket) => {
    socket.emit("message", "Welcome")

    socket.broadcast.emit('message', 'A user has joined the chat')

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
    })

    socket.on('chatMessage', (message) => {
        io.emit('message', message)
    })
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`))