const accessService = require('../services/accessService');
const newToken = require('../services/tokensService');

const login = async (req, res) => {
    try{
    const {email, password} = req.query;
    const user = await accessService.login(email, password);
    if(!user){
        return res.status(400).json({message: 'Credenciales incorrectas'});
    }
    const user_id = user.id;
    const token = user.dataValues.token
    await newToken.newToken(token);
    return res.set('Authorization', user.dataValues.token).json({message: 'Inicio de sesión exitoso', user_id });

    }catch(error){
        console.error('Error en el inicio de sesión:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
    
}

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
        const {email, password} = data;
        const user = await accessService.updatePassword(email, password);
        if(!user){
            console.error('Error en la actualización de contraseña');
            return;
        }
        console.log('Contraseña actualizada');
        
    }catch(error){
        console.error('Error en la actualización de contraseña:');
        
    }
};

module.exports = { login, newUser, updatePassword };