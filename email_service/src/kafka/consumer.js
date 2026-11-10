import {Kafka} from 'kafkajs'
import EVENTS from '../../../constants/event.js';
import { emailQueue } from '../../bullmq/queue.js';
const kafka=new Kafka({
    clientId:'email-service',
    brokers:[process.env.KAFKA_BROKER || 'localhost:9092']
});
const consumer=kafka.consumer({
    groupId:'email-group'
});
const connectConsumer=async()=>{
    await consumer.connect();
    await consumer.subscribe({topics:[EVENTS.USER_CREATED,EVENTS.ORDER_CONFIRMED,EVENTS.PAYMENT_FAILED]});
    await consumer.run({
        eachMessage:async({topic,message})=>{
            const event=JSON.parse(message.value);
            let user = {};
            if (message.headers["x-user"]) {
                try {
                    const userString = message.headers["x-user"].toString();
                    user = JSON.parse(userString);
                } catch (error) {
                    console.error("Failed to parse user context from headers", error);
                }
            }
            event['to']=user.email;
            event['name']=user.name;
            console.log(event);
            console.log(topic);
            emailQueue.add('email',{
                topic,
                event
            },{ delay: 5000 } );
            
        }
    })
}
export { connectConsumer };