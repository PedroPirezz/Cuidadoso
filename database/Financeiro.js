const Sequelize = require('sequelize')
const connection = require('./database.js')

const Financeiro = connection.define('financeiro', {

    IDCuidadoso: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    IDSolicitacao: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    NomeCuidadoso: {
        type: Sequelize.STRING,
        allownull: false
    },
    DataAceitacao: {  
        type: Sequelize.STRING, 
        allownull: false
    },
    ValoraPagar: {
        type: Sequelize.FLOAT,
        allownull: false
    },
    ValorTotal: {
        type: Sequelize.FLOAT,
        allownull: false
    },
    Status: {
        type: Sequelize.STRING,
        allownull: false
    }
    
})

// const Respostas = connection.define('respostas', {


// })






Financeiro.sync({ force: false }).then(() => {
    console.log("tabela Financeira conectada")
})

module.exports = Financeiro