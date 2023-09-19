const Sequelize = require('sequelize')
const connection = require('./database.js')

const Perfil = connection.define('perfil', {

    IDCadastro: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    Nome: {
        type: Sequelize.STRING,
        allownull: false
    },
    Email: {
        type: Sequelize.STRING,
        allownull: false
    },
   
    Foto: {
        type: Sequelize.DataTypes.BLOB('long'),
        allownull: true
    },
    
})

// const Respostas = connection.define('respostas', {


// })






Perfil.sync({ force: false }).then(() => {
    console.log("tabela Perfil conectada")
})

module.exports = Perfil