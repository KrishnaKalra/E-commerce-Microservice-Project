import { Kafka } from 'kafkajs';
import EVENTS from '../../../constants/event.js';

const kafka = new Kafka({
    clientId: 'inventory-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});
const producer = kafka.producer();

const connectProducer = async () => await producer.connect();

const emitInventoryReserved = async (user, orderId) => {
    //console.log('hi payment emmiter');
    await producer.send({
        topic: EVENTS.INVENTORY_RESERVED,
        messages: [{ 
            value: JSON.stringify({ orderId }), 
            headers: { 'x-user': JSON.stringify(user || {}) }
        }]
    });
};

const emitReservationFailed = async (user, orderId) => {
    await producer.send({
        topic: EVENTS.RESERVATION_FAILED,
        messages: [{ 
            value: JSON.stringify({ orderId }), 
            headers: { 'x-user': JSON.stringify(user || {}) }
        }]
    });
};

export { connectProducer, emitInventoryReserved, emitReservationFailed };