import { Kafka } from 'kafkajs';
import EVENTS from '../../../constants/event.js';

const kafka = new Kafka({
    clientId: 'auth-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});
const producer = kafka.producer();

const connectProducer = async () => await producer.connect();

const emitUserCreated = async (user) => {
    console.log(user);
    await producer.send({
        topic: EVENTS.USER_CREATED,
        messages: [{ 
            value: JSON.stringify(user),
            headers: { 'x-user': JSON.stringify(user) }
        }]
    });
}; 



export { connectProducer,emitUserCreated};