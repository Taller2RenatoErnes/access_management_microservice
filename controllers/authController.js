const accessService = require('../services/accessService');
const tokenService = require('../services/tokensService');
const jwt = require('../middleware/jwt');

const login = async (req, res) => {
    try{
    const {email, password} = req.body;
    const user = await accessService.login(email, password);
    if(!user){
        return res.status(401).json({message: 'Credenciales incorrectas'});
    }
    var token = await jwt.getTokenAuth(req);
    if(!req.headers.authorization){
        token = await jwt.generateToken(user.dataValues.id);
        user.dataValues.token = token;
    }

    const isBlacklisted = await tokenService.isBlacklisted(token);
    if (isBlacklisted) {
        return res.status(401).json({message: 'Usuario no autorizado'});
    }
    const user_id = user.id;
    await tokenService.newToken(token);
    return res.set('Authorization', user.dataValues.token).json({message: 'Inicio de sesión exitoso', user_id });

    }catch(error){
        console.error('Error en el inicio de sesión:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
    
}

const getId = async (req, res) => {
    try{
        const token = await jwt.getTokenAuth(req);
        const id = await jwt.getIdJWT(token);
        return res.json({id});
    }catch(error){
        console.error('Error al obtener el ID del usuario:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};


const newUser = async (data) => {
    try{
        const {name, email, password} = data;
        const user = await accessService.newUser(name, email, password);
        if(!user){
            console.error('Error en la creación de usuario');
            return;
        }
        console.log('Nuevo usuario creado');
        
    }catch(error){
        console.error('Error en el registro de usuario:');
        
    }
};  

const updatePassword = async (data) => {
    try{
        const {email, password,token} = data;
        const user = await accessService.updatePassword(email, password, token);
        if(!user){
            console.error('Error en la actualización de contraseña');
            return;
        }
        console.log('Contraseña actualizada');
        
    }catch(error){
        console.error('Error en la actualización de contraseña:');
        
    }
};

module.exports = { login, newUser, updatePassword, getId };