const sequelizedB = require('../utils/database');
const Sequelize = require('sequelize');


//define a sequelize model, representing a table in database
const Products = sequelizedB.define('products',
{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,  // To store the image URL or file path
      },
});

module.exports = Products;
