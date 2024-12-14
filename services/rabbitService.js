const amqp = require('amqplib');
const {newUser, updatePassword} = require('../controllers/authController');

let channel;
const handlers = {
  register: newUser,
  password: updatePassword,
};
class RabbitService{
  constructor(){
    this.queues = {
      register: process.env.RABBITMQ_REGISTER_QUEUE,
      password: process.env.RABBITMQ_PASSWORD_QUEUE,
    };
  }


  async setupRabbitMQ(){
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      for (const queueName in this.queues) {
        const queue = this.queues[queueName];  // Obtener el nombre de la cola
        this.consumeResponse(queue);  // Escuchar cada cola
      }
    } catch (error) {
      console.error('Error configurando RabbitMQ:', error);
    }
  }

 
  consumeResponse(queue){
    console.log(`Escuchando mensajes en la cola: ${queue}...`);
    
    channel.consume(
        queue,
        async (msg) => {
            try {
                const message = JSON.parse(msg.content.toString());
                console.log(`Mensaje recibido en la cola ${queue}:`, message);
                const handlerKey = Object.keys(this.queues).find(
                  (key) => this.queues[key] === queue
                );
        
                if (!handlerKey) {
                  throw new Error(`No se encontró un handler para la cola ${queueName}`);
                }
        
                const handler = handlers[handlerKey];
                await handler(message);
                channel.ack(msg);

            } catch (error) {
                console.error(`Error procesando mensaje en ${queue}:`, error);
                
            }
        },
        { noAck: false }
    );
    
  }
}


// Generar un ID único para correlacionar solicitudes y respuestas
const generateCorrelationId = () => {
  return Math.random().toString() + Date.now().toString();
};


module.exports = RabbitService;