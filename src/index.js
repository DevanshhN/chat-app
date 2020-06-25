const path = require('path')
const http = require('http')
const express = require('express')
const socketio =  require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
    console.log('New WebSocket connection')

    // To send a event on server we use socket.emit()
    //  Anything we provide on emit past the first argument (event name) is going to be available from the callback function on the client
    socket.emit('message', "Welcome bro!")
    
    // socket.broadcast.emit() sends message to everyone execpt the current user 
    socket.broadcast.emit('message','A new user has joined ')

    socket.on('sendMessage', (message)=>{
        // socket.emit emits it to only 1 single connection io.emit emits it to all the connections
        // socket.emit('countUpdated',count)
        io.emit('message', message)   
    })

    socket.on('disconnect',()=>{
        io.emit('message', "A user has disconnected")
    })
})

app.use(express.static('public'))
server.listen(PORT, () =>{
    console.log('Server is up on port',PORT)
})