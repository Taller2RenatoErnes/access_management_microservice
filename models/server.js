express = require('express');
const logger = require('morgan');
const initialConnection = require('./database/database.js');
const cors = require('cors');
const Token = require("../models/database/Tokens.js");
const RabbitService = require('../services/rabbitService.js');
//const {generateToken, validateJWT} = require('../middleware/jwt.js');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 4000;
        this.Server = require('http').createServer(this.app);
        
        
        this.middlewares();
        this.dBConnection();
        this.rabbitService();
    }


    async dBConnection(){
        try {
            await initialConnection.authenticate();
            console.log('Database online');

            const models = [Token];

            for (const model of models) {
                await model.sync({ force: false });
                console.log(model.name, 'table created');
            }
            
            console.log('Database sync');
        } catch (error) {
            console.log('Error de conexión en BDD: ', error);
            throw new Error(error);
        }
    }
    async rabbitService(){
        try {
            this.rabbitService = new RabbitService();
            await this.rabbitService.setupRabbitMQ();
            console.log('RabbitMQ configurado correctamente');
        } catch (error) {
            console.error('Error configurando RabbitMQ:', error);
        }
    }

    middlewares(){
        this.app.use(logger('dev'));
        this.app.use(cors());
        this.app.use(express.json());
    }



    listen(){
        this.Server.listen(this.port, ()=> {
            console.log('Servidor corriendo en puerto', this.port);
        })
    }
}

module.exports = Server;