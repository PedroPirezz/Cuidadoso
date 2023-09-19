const Sequelize = require('sequelize')
const connection = new Sequelize('cuidadoso', 'root', 'admin',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports=connection