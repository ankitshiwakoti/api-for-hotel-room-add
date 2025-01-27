const sequelizedB = require('../utils/database');
const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');


const User = sequelizedB.define('user',
    {
        id:{
            type: Sequelize.STRING(36),
            defaultValue: () => uuidv4(),
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }

    });
    
module.exports = User;