const Sequelize = require('sequelize')
const connection = require('./database.js')
const Solicitacoes = connection.define('Solicitacoes', {
    IDSolicitante: {
        type: Sequelize.INTEGER, 
        allowNull: false
    },NomeSolicitante: {
        type: Sequelize.STRING,
        allowNull: false 
    },
    IDCuidadoso: {
        type: Sequelize.INTEGER,  
        allowNull: false
    },
    NomeCuidadoso: {
        type: Sequelize.STRING,
        allowNull: false
    },
    DiaAtendimento: {
        type: Sequelize.INTEGER,  
        allowNull: false 
    },
    HoraAgendada: {
        type: Sequelize.STRING, 
        allowNull: true 
    },
    MesAgendado: {
        type: Sequelize.STRING, 
        allowNull: true 
    },  
    Deficiencia: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Mensagem: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    StatusPedido: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Valor: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    Estado: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Cidade: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Rua: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Numero: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Complemento: {
        type: Sequelize.STRING, 
        allowNull: true
    },
    Referencia: {
        type: Sequelize.STRING,
        allowNull: true
    },
    DataCriacao: {
        type: Sequelize.STRING,
        allowNull: true
    }
    
})

Solicitacoes.sync({ force: false }).then(() => {
    console.log("tabela de Solicitacoes conectada")
})

module.exports = Solicitacoes