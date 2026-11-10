import { Kafka } from 'kafkajs';
import EVENTS from '../../../constants/event.js';
import { verifyPayment } from '../service/payement.service.js';

const kafka = new Kafka({
    clientId: 'payment-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({
    groupId: 'payment-group'
});

const connectConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topics: [EVENTS.INVENTORY_RESERVED] });
    
    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            const event = JSON.parse(message.value.toString());
            //console.log(event);
            let user = null;
            if (message.headers && message.headers['x-user']) {
                try {
                    user = JSON.parse(message.headers['x-user'].toString());
                } catch (error) {
                    console.error(error);
                }
            }
            try {
                await verifyPayment(user, event.orderId, event.paymentId);
            } catch (error) {
                console.log(error);
            }
        }
    });
};

export { connectConsumer };