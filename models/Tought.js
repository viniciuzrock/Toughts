const { DataTypes } = require('sequelize')
const db = require('../db/conn')
//User
const User = require('./User')

const Tought = db.define('Tought',{
    title:{
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
})

Tought.belongsTo(User) //Um pensamento pertence a um usuário
User.hasMany(Tought) //Um usuário pode ter vários pensamentos
module.exports = Tought