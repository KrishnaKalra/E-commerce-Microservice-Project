import { Kafka } from 'kafkajs';
import EVENTS from '../../../constants/event.js';

const kafka = new Kafka({
    clientId: 'product-service',
    brokers: ['localhost:9092']
});
const producer = kafka.producer();
const connectProducer = async () => await producer.connect();

const emitProductCreated = async (user, product) => {
    await producer.send({
        topic: EVENTS.PRODUCT_CREATED,
        messages: [{ 
            value: JSON.stringify(product),
            headers: { 'x-user': JSON.stringify(user) }
        }]
    });
}

export { connectProducer, emitProductCreated };