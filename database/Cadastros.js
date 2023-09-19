const Sequelize = require('sequelize')
const connection = require('./database.js')

const Cadastros = connection.define('cadastros', {

    Nome: {
        type: Sequelize.STRING,
        allownull: false
    },
    CPF: {
        type: Sequelize.STRING, 
        allownull: false
    },
    TipoConta: {
        type: Sequelize.STRING,
        allownull: false 
    },
    Email: {
        type: Sequelize.STRING, 
        allownull: false 
    },
    Senha: {
        type: Sequelize.STRING, 
        allownull: false
    },
    Token: {
        type: Sequelize.STRING,
        allownull: false
    }
    ,
    Formacao: {
        type: Sequelize.STRING,
        allownull: true
    },
    DataNacimento: {
        type: Sequelize.STRING,
        allownull: false
    },
    Genero: {
        type: Sequelize.STRING,
        allownull: false
    },
    Celular: { 
        type: Sequelize.STRING,
        allownull: false
    },
    FotoPerfil: {
        type: Sequelize.DataTypes.BLOB('long'),
        allownull: true
    },
    BonsAntecedentes: {
        type: Sequelize.DataTypes.BLOB('long'),
        allownull: true
    },
    Estado: {
        type: Sequelize.STRING,
        allownull: true
    },
    Cidade: {
        type: Sequelize.STRING,
        allownull: true
    },
    Bairro: {
        type: Sequelize.STRING,
        allownull: true
    },
    Rua: {
        type: Sequelize.STRING,
        allownull: true
    },
    Numero: {
        type: Sequelize.STRING,
        allownull: true
    },
    Complemento: {
        type: Sequelize.STRING,
        allownull: true
    },
    Referencia: {
        type: Sequelize.STRING,
        allownull: true
    },
    descricao:{
        type:Sequelize.TEXT,
        allowNull:true
    }
})

// const Respostas = connection.define('respostas', {


// })






Cadastros.sync({ force: false }).then(() => {
    console.log("tabela criada")
})

module.exports = Cadastros