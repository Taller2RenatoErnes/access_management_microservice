const amqp = require('amqplib');
const tokenService = require('../services/tokensService');

const handlers = {
  verifyToken: async (data) => {
    const { token } = data;
    const isValid = await tokenService.isBlacklisted(token);
    return isValid ;
    
  },
};

let channel;

class RabbitService{
  constructor(){
    this.queueName = 'auth_queue';
    this.handlers = handlers;
    this.response_queue = 'auth_response_queue';
  }




  async setupRabbitMQ(){
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue(this.response_queue, { durable: true });
  

      this.consumeResponse();

    } catch (error) {
      console.error('Error configurando RabbitMQ:', error);
    }
  }

  async sendMessageAndWaitResponse(message){
    return new Promise((resolve, reject) => {
      this.consumeResponse();

      console.log('Enviando mensaje:', message);
      channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), {
      });
      console.log('Mensaje enviado');
    
    });

  }
 
  consumeResponse(){
    console.log(`Escuchando mensajes en la cola: ${this.queueName}...`);
    return new Promise((resolve, reject) => {
      channel.consume(
          this.queueName,
          async (msg) => {
              try {
                  const message = JSON.parse(msg.content.toString());
                  console.log(`Mensaje recibido en la cola ${this.queueName}:`, message);
                  const { operation, data, correlationId, replyTo } = message;
                  if (this.handlers[operation]) {
                      const result = await this.handlers[operation](data);
                      console.log(`Resultado de la operación ${operation}:`, result);
                      if (replyTo) {
                           channel.sendToQueue(
                               replyTo,
                               Buffer.from(JSON.stringify({ correlationId, result })),
                               { correlationId }
                           );
                          console.log(`Respuesta enviada a ${replyTo} para la operación ${operation}.`);
                      }
                  } else {
                      console.error(`Operación no soportada: ${operation}`);
                  }

                  channel.ack(msg);
              } catch (error) {
                  console.error(`Error procesando mensaje en ${this.queueName}:`, error);
                  reject(error);
              }
          },
          { noAck: false }
      );
    });
  }
}


// Generar un ID único para correlacionar solicitudes y respuestas
const generateCorrelationId = () => {
  return Math.random().toString() + Date.now().toString();
};


module.exports = RabbitService;