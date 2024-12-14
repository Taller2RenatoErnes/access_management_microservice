const express = require('express');
const logger = require('morgan');
const initialConnection = require('./database/database.js');
const cors = require('cors');
const Token = require("../models/database/Tokens.js");
const User = require("../models/database/User.js");
const RabbitService = require('../services/rabbitService.js');
// const { generateToken, validateJWT } = require('../middleware/jwt.js');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 4000;
        this.Server = require('http').createServer(this.app);
        this.paths = {
            access: '/api/access',
        };
        
        this.routes();
        this.middlewares();
        this.dBConnection();
        this.rabbitService();
    }

    async dBConnection() {
        try {
            await initialConnection.authenticate();
            console.log('Database online');

            const models = [Token, User];

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

    async rabbitService() {
        try {
            this.rabbitService = new RabbitService();
            await this.rabbitService.setupRabbitMQ();
            console.log('RabbitMQ configurado correctamente');
        } catch (error) {
            console.error('Error configurando RabbitMQ:', error);
        }
    }

    routes() {
        const accessRoutes = require('../routes/accessRoutes.js');
        this.app.use(this.paths.access, accessRoutes);
    }

    middlewares() {
        this.app.use(logger('dev'));
        this.app.use(cors());
        this.app.use(express.json()); // Middleware para solicitudes JSON
        this.app.use(                //this mean we don't need to use body-parser anymore
            express.urlencoded({
              extended: true,
            })
          );  // Middleware para formularios URL-encoded
    }

    listen() {
        this.Server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;
