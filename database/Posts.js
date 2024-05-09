const Sequelize = require('sequelize')
const connection = require('./database.js')
const Posts = connection.define('posts', {

    IDCadastro: {
        type: Sequelize.INTEGER, 
        allownull: false
    },
    NomeCadastro: {
        type: Sequelize.STRING,  
        allownull: false
    },
    Assunto: {
        type: Sequelize.STRING,
        allownull: false
    },
    Foto: {
        type: Sequelize.DataTypes.BLOB('long'),
        allownull: true 
    },
    Data: {
        type: Sequelize.STRING,
        allownull: false
    }
})


Posts.sync({ force: false }).then(() => {
    console.log("Posts table connected with success")
})

module.exports = Posts