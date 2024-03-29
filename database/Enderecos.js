const Sequelize = require('sequelize')
const connection = require('./database.js')
const Enderecos = connection.define('enderecos', {

    IDCadastro: {
        type: Sequelize.INTEGER, 
        allownull: false
    },
    Estado: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Cidade: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Bairro:{
    type: Sequelize.STRING, 
    allowNull: false
    },
    Rua: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Numero: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Complemento: {
        type: Sequelize.STRING,
        allowNull: true
    },
    Referencia: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

Enderecos.sync({ force: false }).then(() => {
    console.log("tabela de Endereços conectada")
})

module.exports = Enderecos