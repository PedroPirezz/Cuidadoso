const Sequelize = require('sequelize')
const connection = require('./database.js')
const Chat = connection.define('chat', {


    IDRemente: {  
        type: Sequelize.INTEGER, 
        allownull: false
    },
    NomeRemetente: {  
        type: Sequelize.STRING, 
        allownull: false
    },
    Mensagem: {  
        type: Sequelize.TEXT, 
        allownull: false
    },
    IDServico: {  
        type: Sequelize.INTEGER, 
        allownull: false
    },
    Data: {  
        type: Sequelize.STRING, 
        allownull: false
    },
    Horario: {
        type: Sequelize.STRING,
        allownull: false
    },
    Status: {
        type: Sequelize.STRING,
        allownull: false
    }
    
})

Chat.sync({ force: false }).then(() => {
    console.log("Chat table connected with success")
})

module.exports = Chat