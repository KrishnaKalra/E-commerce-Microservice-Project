import {Kafka} from 'kafkajs';
import EVENTS from '../../../constants/event.js'

const kafka=new Kafka({
    clientId:'order-service',brokers:['localhost:9092']
});
const producer=kafka.producer();

const connectProducer=async()=> await producer.connect();

const emitOrderCreated=async(user,order)=>{
    await producer.send({
        topic:EVENTS.ORDER_CREATED,
        messages:[{value:JSON.stringify(order),headers: {
        'x-user': JSON.stringify(user),
      }}]
    })
}
const emitOrderConfirmed=async(user,order)=>{
    await producer.send({
        topic:EVENTS.ORDER_CONFIRMED,
        messages:[{value:JSON.stringify(order),headers: {
        'x-user': JSON.stringify(user),
      }}]
    })
}
const emitOrderFailed=async(user,order)=>{
    await producer.send({
        topic:EVENTS.ORDER_FAILED,
        messages:[{value:JSON.stringify(order),headers: {
        'x-user': JSON.stringify(user),
      }}]
    })
}
export {connectProducer,emitOrderCreated,emitOrderFailed,emitOrderConfirmed}; 



