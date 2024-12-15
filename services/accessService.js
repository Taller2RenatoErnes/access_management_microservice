const bcrypt = require('bcrypt');
const User = require('../models/database/User'); // Asegúrate de que la ruta sea correcta
const tokenService = require('./tokensService');
const { generateToken, getIdJWT } = require('../middleware/jwt.js');

// Clave secreta para firmar el JWT

const login = async (email,password) => {

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return false
        }
        const isPasswordValid = await bcrypt.compare(password, user.dataValues.password);
        if (!isPasswordValid) {
            return false
        }
        if(!user.dataValues.token){
            const token = await generateToken(user.dataValues.id);
            user.dataValues.token = token;
        }
        const isBlacklisted = await tokenService.isBlacklisted(user.dataValues.token);
        if (isBlacklisted) {
            return false
        }
        
        return user; 
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};


const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
        });

        return res.status(201).json({
            message: 'Usuario creado exitosamente',
            user,
        });
    } catch (error) {
        console.error('Error en el registro de usuario:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const newUser = async (name, email, password) => {
    try {
        const user = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
        });
        return user;
    } catch (error) {
        console.error('Error en el registro de usuario:');
        return false;
    }
};

const updatePassword = async (email, password,token) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return false;
        }
        user.password = await bcrypt.hash(password, 10);
        await tokenService.newToken(token);
        await user.save();
        return user;
    }catch(error){
        console.error('Error en la actualización de contraseña:');
        return false;
    }
}

module.exports = { login, register, newUser, updatePassword };