const { Sequelize } = require('sequelize');
const config = require('../../config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mssql',
  });
const initialConnection = new Sequelize('master', config.username, config.password, {
    host: config.host,
    dialect: 'mssql',
  });
module.exports = sequelize, initialConnection;
