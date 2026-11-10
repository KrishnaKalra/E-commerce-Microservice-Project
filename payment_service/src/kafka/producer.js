import { Kafka } from 'kafkajs';
import EVENTS from '../../../constants/event.js';

const kafka = new Kafka({
    clientId: 'payment-service', 
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});
const producer = kafka.producer();

const connectProducer = async () => await producer.connect();

const emitPaymentVerified = async (user, orderData) => {
    await producer.send({
        topic: EVENTS.PAYMENT_VERIFIED,
        messages: [{ 
            value: JSON.stringify(orderData),
            headers: { 'x-user': JSON.stringify(user || {}) }
        }]
    });
};

const emitPaymentFailed = async (user, orderData) => {
    await producer.send({
        topic: EVENTS.PAYMENT_FAILED,
        messages: [{ 
            value: JSON.stringify(orderData),
            headers: { 'x-user': JSON.stringify(user || {}) }
        }]
    });
};

export { connectProducer, emitPaymentVerified, emitPaymentFailed };