const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toughts','root','1234',{
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conectou')
} catch (err) {
    console.log('erro:'+err)    
}

module.exports = sequelize