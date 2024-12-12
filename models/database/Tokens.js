const { DataTypes } = require('sequelize');
const sequelize = require('./database.js');
const { v4: uuidv4 } = require('uuid');

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,

    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    // estaEliminado: {
    //     type: DataTypes.BOOLEAN,
    //     defaultValue: false,
    // },
}, {
    timestamps: true,
});




module.exports = Token;
