const { DataTypes } = require('sequelize');
const sequelize = require('./database.js');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },

}, {
    timestamps: true,
});

module.exports = User;