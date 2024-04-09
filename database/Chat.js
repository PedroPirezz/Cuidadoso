const Sequelize = require('sequelize')
const connection = require('./database.js')
const Chat = connection.define('chat', {


    IDRemetente: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    IDServico: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    IDSolicitante: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    NomeSolicitante: {
        type: Sequelize.STRING,
        allownull: false
    },
    IDCuidadoso: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    NomeCuidadoso: {
        type: Sequelize.STRING,
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
    console.log("tabela chat conectada")
})

module.exports = Chat