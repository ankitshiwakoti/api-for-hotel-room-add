const Sequelize = require('sequelize');

const db = {
    host: 'localhost',
    user: 'root',
    database: 'shopsequel',
    password: 'root',
    dialect: 'mysql'
};

const sequelize = new Sequelize(db.database, db.user, db.password, {
    host: db.host,
    dialect: db.dialect
});

module.exports = sequelize;

