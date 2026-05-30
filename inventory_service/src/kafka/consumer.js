import { Kafka } from 'kafkajs';
import EVENTS from '../../../constants/event.js';
import * as InventoryService from '../service/inventory.service.js';

const kafka = new Kafka({
    clientId: 'inventory-service',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({
    groupId: 'inventory-group'
});

const connectConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topics: [EVENTS.PRODUCT_CREATED, EVENTS.ORDER_CREATED ,EVENTS.PAYMENT_VERIFIED] });
    
    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            const event = JSON.parse(message.value.toString());
            let user = null;

            if (message.headers && message.headers['x-user']) {
                try {
                    user = JSON.parse(message.headers['x-user'].toString());
                } catch (error) {
                    console.error("Failed to parse user context from headers", error);
                }
            }
            
            try {
                if (topic === EVENTS.PRODUCT_CREATED) {
                    const productId = event.id;
                    await InventoryService.createInventory(productId, user);
                } else if (topic === EVENTS.ORDER_CREATED) {
                    const orderId = event.id;
                    const productId = event.productId;
                    const reservedQty = event.quantity;
                    await InventoryService.createInventoryReservation(productId, orderId, user, reservedQty);
                } else if (topic === EVENTS.PAYMENT_VERIFIED) {
                    const orderId= event.orderId;
                    console.log('hi payment');
                    await InventoryService.updateRerservationStatus(orderId,"CONFIRMED");
                }
            } catch (error) {
                console.log(`Error processing topic ${topic}:`, error);
            }
        }
    });
};

export { connectConsumer };