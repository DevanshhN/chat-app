const path = require('path')
const http = require('http')
const express = require('express')
const socketio =  require('socket.io')
const Filter = require('bad-words')
const {generateMessage} = require('./utils/messages')
const {generatelocationMessage} = require('./utils/messages')
// const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

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
    // socket.broadcast.emit() sends message to everyone execpt the current user 
    socket.on('join', (options, callback)=>{
        const {error, user} = addUser({id:socket.id, ...options})
        
        if(error){
            return callback(error)
        }
        // Socket.join allows us to join a given chatroom and we pass the name of chatroom we are going to join
        socket.join(user.room)
    
         // To send a event on server we use socket.emit()
    //  Anything we provide on emit past the first argument (event name) is going to be available from the callback function on the client
        socket.emit('message', generateMessage("admin",'Welcome bro!'))

        // socket.broadcast.to.emit() sends message to everyone execpt the current user in the respective room
        socket.broadcast.to(user.room).emit('message',generateMessage('admin',`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
          room : user.room,
          users : getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback)=>{
        // socket.emit emits it to only 1 single connection io.emit emits it to all the connections
        // socket.emit('countUpdated',count)
        const user = getUser(socket.id)
        const filter = new Filter()
        
        if (filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }
        
        io.to(user.room).emit('message', generateMessage(user.username,message))   
        callback()

    })
    socket.on('sendLocation',(coords, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if (user){
            io.to(user.room).emit('message', generateMessage('admin',`A ${user.username} has disconnected`))
            io.to(user.room).emit('roomData',{
                room : user.room,
                users : getUsersInRoom(user.room)
            })
        }  
    })
})

app.use(express.static('public'))
server.listen(PORT, () =>{
    console.log('Server is up on port',PORT)
})