import { Kafka } from "kafkajs";
import * as OrderService from "../service/order.service.js";
import EVENTS from "../../../constants/event.js";
const kafka = new Kafka({
    clientId: "order-service",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const consumer = kafka.consumer({
    groupId: "order-group",
});
const connectConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({
        topics: [
            EVENTS.INVENTORY_RESERVED,
            EVENTS.RESERVATION_FAILED,
            EVENTS.PAYMENT_VERIFIED,
            EVENTS.PAYMENT_FAILED,
        ],
    });
    console.log("big wla hello");
    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            const event = JSON.parse(message.value);
            let user = null;
            // 2. Extract, decode, and parse the full user object from the header
            console.log(topic);
            if (message.headers && message.headers["x-user"]) {
                try {
                    const userString = message.headers["x-user"].toString();
                    user = JSON.parse(userString);
                } catch (error) {
                    console.error("Failed to parse user context from headers", error);
                }
            }
            try {
                if (topic === EVENTS.INVENTORY_RESERVED) {
                    const id = event.orderId;
                    let inventoryStatus = "RESERVED";
                    await OrderService.updateOrderStatus(user, id, { inventoryStatus });
                } else if (topic === EVENTS.PAYMENT_VERIFIED) {
                    const id = event.orderId;
                    const paymentStatus = "VERIFIED";
                    console.log('Payment verified for order:', id);
                    await OrderService.updateOrderStatus(user, id, { paymentStatus, status: "CONFIRMED" });
                } else if (topic === EVENTS.RESERVATION_FAILED) {
                    const id = event.orderId;
                    console.log('Inventory reservation failed or expired for order:', id);
                    await OrderService.updateOrderStatus(user, id, { 
                        status: "CANCELLED", 
                        inventoryStatus: "FAILED" 
                    });
                } else if (topic === EVENTS.PAYMENT_FAILED) {
                    const id = event.orderId;
                    console.log('Payment failed for order:', id);
                    await OrderService.updateOrderStatus(user, id, { 
                        status: "CANCELLED", 
                        paymentStatus: "FAILED" 
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },
    });
};
export { connectConsumer }; 
