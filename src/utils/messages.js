// const Filter = require('bad-words')

const generateMessage = (username,text) =>{
    return {
        username,
        text,
        createdAt : new Date().getTime()
    }
}

const generateLocationMessage = (username,url) =>{
    return {
        username,
        url,
        createdAt : new Date().getTime()
    }
}

// const generateProfanityMessage = () =>{
//     return {

//     }
// }

 module.exports = {
     generateMessage,
     generateLocationMessage
 }