const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/database/User');

/**
 * Obtiene el ID del usuario a partir del token JWT.
 * @param {string} token - El token JWT.
 * @returns {string} El ID del usuario.
 */
const getIdJWT = (token) => {
    const secret = process.env.SECRET;
    const { id } = jwt.verify(token, secret);
    return id;
}

/**
 * Genera un nuevo token JWT para el usuario.
 * @param {string} id - El ID del usuario.
 * @returns {Promise<string>} El token JWT generado.
 */
const generateToken = (id = '') => {
    return new Promise((resolve, reject) => {
        const payload = { id };
        jwt.sign(payload, process.env.SECRET, { expiresIn: '1460h' }, (error, token) => {
            if (error) {
                reject('No se pudo generar el token: ', error);
            } else resolve(token);
        });
    });
}

/**
 * Middleware para validar el token JWT en las solicitudes gRPC.
 * @param {Object} call - El objeto de llamada de gRPC.
 * @param {Function} callback - La función de callback de gRPC.
 * @returns {Promise<void>}
 */
const validateJWT = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization; // Extraer el encabezado 'Authorization'

        if (!authorization) {
            return res.status(401).json({
                error: 'No se ha proporcionado un token de autenticación',
            });
        }
        const tokenParts = authorization.split(' ');
        if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
            return res.status(401).json({
                error: 'Formato de token inválido. Use Bearer <token>',
            });
        }

        const token = tokenParts[1];
        
        // Verificar el token y obtener el ID del usuario
        const { id } = jwt.verify(token, process.env.SECRET);
        // Buscar al usuario en la base de datos
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(401).json({
                error: 'Token inválido, usuario no encontrado',
            });
        }
        // Agregar el usuario al objeto `req` para su uso posterior
        return res.set('Authorization', token).json({message: 'Token válido', user_id: user.dataValues.id});
    } catch (error) {
        console.error('Error al validar el token:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expirado',
            });
        }

        return res.status(401).json({
            error: 'Token no válido', 
        });
    }
};

const getTokenAuth = (req) => {
    const authorization = req.headers.authorization; 

    if (!authorization) {
        return null; 
    }

    const tokenParts = authorization.split(' '); 

    if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
        return null; 
    }

    const token = tokenParts[1]; 

    return token; 

}
module.exports = { validateJWT, getIdJWT, generateToken, getTokenAuth};
