const users = []
// adduser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) =>{
    // Cleaning the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validating the data
    if (!username || !room){
        return {
            error: "Username and room are required"
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validating username
    if (existingUser) {
       return{
        error: "Username is in user"
       }
    }

    // Store user 
    const user = { id, username, room}
    users.push(user)
    return {user}
}

// Remove a user by id

const removeUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })

    if (index !==-1){
        return users.splice(index,1)[0]
    }
}

// Get user by id

const getUser = (id) =>{
    return users.find((user) => user.id === id)
}

// Get users in a room

const getUsersInRoom = (room) => {
    room = room.toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}