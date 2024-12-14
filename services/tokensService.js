const Token = require('../models/database/Tokens.js');


const isBlacklisted = async (token) => {
    try {
        const isBlacklisted = await Token.findOne({ where: { token } });
        return isBlacklisted ? true : false;
    } catch (error) {
        console.error('Error:', error);
        return false; 
    }
};

const newToken = async (user_id, token) => {
    try {
        const newToken = await Token.create({ user_id, token });
        return newToken;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};




module.exports = { isBlacklisted, newToken };