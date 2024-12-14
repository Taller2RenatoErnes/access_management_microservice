const Token = require('../models/database/Tokens.js');


const isBlacklisted = async (token) => {
    try {
        const isBlacklisted = await Token.findOne({ where: { token } });
        return isBlacklisted;
    } catch (error) {
        console.error('Error:', error);
        return false; 
    }
};

const newToken = async (token) => {
    try {
        const newToken = await Token.create({ token });
        return newToken;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};




module.exports = { isBlacklisted, newToken };